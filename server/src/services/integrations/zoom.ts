import axios from "axios";

const ZOOM_BASE_URL = "https://api.zoom.us/v2";

async function getZoomAccessToken(): Promise<string> {
  const response = await axios.post(
    "https://zoom.us/oauth/token",
    new URLSearchParams({
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID!,
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );
  return response.data.access_token;
}

export interface ZoomRecording {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  recording_files: Array<{
    id: string;
    recording_type: string;
    download_url: string;
  }>;
}

export async function getZoomRecordings(from?: string, to?: string): Promise<ZoomRecording[]> {
  const token = await getZoomAccessToken();
  const params: any = { type: "recorded" };
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await axios.get(`${ZOOM_BASE_URL}/users/me/recordings`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data.meetings || [];
}

export async function downloadZoomRecording(downloadUrl: string): Promise<Buffer> {
  const token = await getZoomAccessToken();
  const response = await axios.get(downloadUrl, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data);
}
