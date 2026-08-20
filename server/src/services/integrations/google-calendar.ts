import { google } from "googleapis";
import { getPrisma } from "../../db";

function buildOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google"
  );
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string | null;
  location?: string | null;
  start: string;
  end: string;
  attendees?: string[];
  // Populated from hangoutLink (Google Meet) or a Zoom URL found in the
  // location/description -- lets the frontend surface "this event has a call
  // link" without the caller having to parse raw event text itself.
  meetingUrl: string | null;
}

// Matches both the personal-meeting-ID form (/j/1234567890) and vanity/PMI
// links Zoom also issues; deliberately not the full Zoom URL grammar since
// this is just "does this text contain something worth surfacing", not a
// security boundary (unlike the download-time check in routes/integrations.ts).
const ZOOM_URL_RE = /https?:\/\/[\w.-]*zoom\.us\/(j|my)\/\S+/i;

function extractMeetingUrl(event: {
  hangoutLink?: string | null;
  location?: string | null;
  description?: string | null;
}): string | null {
  if (event.hangoutLink) return event.hangoutLink;
  const haystack = `${event.location || ""} ${event.description || ""}`;
  const match = haystack.match(ZOOM_URL_RE);
  return match ? match[0] : null;
}

export function getGoogleAuthUrl(): string {
  const oauth2Client = buildOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
}

// Hand-written rather than reusing googleapis' own Credentials type: that
// type is re-exported through google-auth-library's internal package path,
// which TS refuses to name in an exported function's inferred return type
// (TS2742 "cannot be named without a reference to ... which is not
// portable"). This local shape covers the fields this codebase actually
// reads off the result.
export interface GoogleTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  scope?: string;
  token_type?: string | null;
  id_token?: string | null;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleTokens> {
  const oauth2Client = buildOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens; // { access_token, refresh_token, expiry_date, ... }
}

/**
 * Returns a usable access token for this user's stored Google Calendar
 * connection, transparently refreshing it first if it's expired (or about to
 * expire within a minute) and persisting the new token/expiry. Returns null
 * if the user has no Google Calendar integration at all -- callers turn that
 * into a 404, not a thrown error, since "not connected" is an expected state.
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  const prisma = getPrisma();
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "google-calendar" } },
  });
  if (!integration) return null;

  const isExpired = integration.expiresAt ? integration.expiresAt.getTime() - 60_000 < Date.now() : false;
  if (!isExpired) return integration.accessToken;

  if (!integration.refreshToken) {
    // Expired with nothing to refresh from -- the caller has to re-run the
    // connect flow; surfacing the stale token would just fail downstream.
    return null;
  }

  const oauth2Client = buildOAuthClient();
  oauth2Client.setCredentials({ refresh_token: integration.refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();

  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      accessToken: credentials.access_token!,
      expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
    },
  });

  return credentials.access_token!;
}

export async function getGoogleCalendarEvents(accessToken: string, timeMin?: string, timeMax?: string): Promise<CalendarEvent[]> {
  const oauth2Client = buildOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const params: any = {
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
  };
  if (timeMin) params.timeMin = timeMin;
  if (timeMax) params.timeMax = timeMax;

  const response = await calendar.events.list(params);

  return (response.data.items || []).map((event) => ({
    id: event.id!,
    summary: event.summary || "No Title",
    description: event.description,
    location: event.location,
    start: event.start?.dateTime || event.start?.date || "",
    end: event.end?.dateTime || event.end?.date || "",
    attendees: event.attendees?.map((a) => a.email || ""),
    meetingUrl: extractMeetingUrl({ hangoutLink: event.hangoutLink, location: event.location, description: event.description }),
  }));
}
