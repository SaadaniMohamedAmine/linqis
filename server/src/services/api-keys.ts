import { randomBytes, createHash } from "crypto";

export function generateApiKey(): { fullKey: string; prefix: string; hash: string } {
  const raw = randomBytes(24).toString("base64url");
  const fullKey = `lnq_live_${raw}`;
  const prefix = fullKey.slice(0, 12); // "lnq_live_abc" -- assez pour reconnaître la clé sans la reconstruire
  const hash = createHash("sha256").update(fullKey).digest("hex");
  return { fullKey, prefix, hash };
}

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}
