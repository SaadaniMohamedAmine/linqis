/**
 * Shared SSRF guards for user-supplied URLs the server itself will fetch.
 *
 * Used by both outbound sinks that take a URL from the client: webhook
 * subscription registration (routes/developers.ts) and the Slack export
 * (routes/exports.ts). Both end up issuing a server-side request from inside
 * the network with the response discarded or unseen, so an unvalidated URL is
 * a blind request primitive pointed at cloud metadata endpoints, localhost
 * services, or internal-only hosts.
 */

/** True for the IPv4 loopback/private/link-local/unspecified ranges. */
export function isBlockedIpv4(a: number, b: number): boolean {
  const isLoopback = a === 127;
  const isPrivate10 = a === 10;
  const isPrivate172 = a === 172 && b >= 16 && b <= 31;
  const isPrivate192 = a === 192 && b === 168;
  const isLinkLocal = a === 169 && b === 254; // covers cloud metadata endpoints (169.254.169.254)
  const isUnspecified = a === 0;
  return isLoopback || isPrivate10 || isPrivate172 || isPrivate192 || isLinkLocal || isUnspecified;
}

/**
 * True for IPv6 loopback (::1), unspecified (::), link-local (fe80::/10),
 * unique-local (fc00::/7), and IPv4-mapped addresses (::ffff:a.b.c.d, in
 * either dotted or the compressed-hex form the WHATWG URL parser actually
 * produces, e.g. "::ffff:7f00:1" for 127.0.0.1) whose embedded IPv4 address
 * is itself blocked. `address` must already have any URL "[...]" brackets
 * stripped.
 */
export function isBlockedIpv6(address: string): boolean {
  const addr = address.toLowerCase();

  if (addr === "::1" || addr === "0:0:0:0:0:0:0:1") return true;
  if (addr === "::" || addr === "0:0:0:0:0:0:0:0") return true;

  // fe80::/10 -- link-local. The third hex character has to be 8/9/a/b for
  // the address to fall in that /10 (fe80..febf), not just start with "fe".
  if (/^fe[89ab]/.test(addr)) return true;

  // fc00::/7 -- unique-local. Covers both the fc00:: and fd00:: halves.
  if (/^f[cd]/.test(addr)) return true;

  // IPv4-mapped, dotted form: ::ffff:a.b.c.d
  const dotted = addr.match(/^::ffff:(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (dotted && isBlockedIpv4(Number(dotted[1]), Number(dotted[2]))) return true;

  // IPv4-mapped, compressed hex form: ::ffff:XXXX:XXXX (what `new URL()`
  // actually normalizes ::ffff:127.0.0.1 to -- ::ffff:7f00:1).
  const hex = addr.match(/^::ffff:([0-9a-f]{1,4}):[0-9a-f]{1,4}$/);
  if (hex) {
    const highGroup = parseInt(hex[1], 16);
    const a = (highGroup >> 8) & 0xff;
    const b = highGroup & 0xff;
    if (isBlockedIpv4(a, b)) return true;
  }

  return false;
}

/**
 * Blocks the obvious SSRF targets for a URL the server will POST to. Doesn't
 * attempt DNS-rebinding protection (no resolve-then-recheck at delivery time)
 * -- just rejects the clearly dangerous literals up front.
 *
 * Returns a human-readable reason string, or null when the URL is acceptable.
 */
export function webhookUrlError(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "url must be a valid URL";
  }

  if (parsed.protocol !== "https:") {
    return "url must use https";
  }

  const rawHost = parsed.hostname.toLowerCase();
  if (rawHost === "localhost") {
    return "url cannot point to a local address";
  }

  // The WHATWG URL parser always wraps IPv6 literals in brackets in
  // `.hostname` (e.g. "[::1]") -- domain names and IPv4 literals never have
  // them, so this is a reliable way to tell IPv6 apart before validating it.
  const isBracketedIpv6 = rawHost.startsWith("[") && rawHost.endsWith("]");
  const host = isBracketedIpv6 ? rawHost.slice(1, -1) : rawHost;

  if (isBracketedIpv6) {
    if (isBlockedIpv6(host)) {
      return "url cannot point to a private or internal address";
    }
    return null;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4 && isBlockedIpv4(Number(ipv4[1]), Number(ipv4[2]))) {
    return "url cannot point to a private or internal address";
  }

  return null;
}
