import type {
  Meeting,
  Transcript,
  Decision,
  ActionItem,
  Disagreement,
  Participant,
} from "@prisma/client";

// The Express API is a separate deployment from the Next.js app (Vercel +
// Railway, see README). NEXT_PUBLIC_API_URL must be set to reach it from the
// browser; it defaults to the local dev server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Request to ${path} failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type MeetingListItem = Meeting & {
  participants: Participant[];
  _count: { actionItems: number; transcripts: number };
};

export type MeetingDetail = Meeting & {
  participants: Participant[];
  transcripts: Transcript[];
  decisions: Decision[];
  actionItems: ActionItem[];
  disagreements: Disagreement[];
};

export type ActionItemWithMeeting = ActionItem & {
  meeting: { id: string; title: string };
};

export function getMeetings(): Promise<MeetingListItem[]> {
  return request<MeetingListItem[]>("/api/meetings");
}

export function getMeeting(id: string): Promise<MeetingDetail> {
  return request<MeetingDetail>(`/api/meetings/${id}`);
}

export function deleteMeeting(id: string): Promise<void> {
  return request<void>(`/api/meetings/${id}`, { method: "DELETE" });
}

export function getActionItems(): Promise<ActionItemWithMeeting[]> {
  return request<ActionItemWithMeeting[]>("/api/action-items");
}

export function updateActionItemStatus(id: string, status: "TODO" | "DONE"): Promise<ActionItem> {
  return request<ActionItem>(`/api/action-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export interface UploadResponse {
  meetingId: string;
  jobId: string;
  duration: number;
  chunked: boolean;
  chunkCount: number;
}

/**
 * Uploads a file with real browser progress events (XHR, not fetch --
 * fetch's request body has no progress API in most browsers) and resolves
 * with the created meeting/job ids once the server has accepted the file.
 * This covers the *upload transfer* only; processing progress afterwards
 * comes from `subscribeToUploadProgress` below.
 */
export function uploadMeetingFile(
  file: File,
  onUploadProgress?: (percent: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "anonymous");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onUploadProgress) {
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new ApiError(xhr.status, "Invalid response from upload endpoint"));
        }
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          message = JSON.parse(xhr.responseText).error || message;
        } catch {
          // ignore parse failure, keep default message
        }
        reject(new ApiError(xhr.status, message));
      }
    };

    xhr.onerror = () => reject(new ApiError(0, "Network error during upload"));
    xhr.send(formData);
  });
}

export interface ProcessingProgressEvent {
  status: "connected" | "transcribing" | "analyzing" | "saving" | "completed" | "error";
  progress?: number;
  chunk?: number;
  total?: number;
  meetingId?: string;
  error?: string;
}

/**
 * Subscribes to the backend's SSE progress stream for a given upload job.
 * Returns an unsubscribe function.
 */
export function subscribeToUploadProgress(
  jobId: string,
  onEvent: (event: ProcessingProgressEvent) => void
): () => void {
  const source = new EventSource(`${API_URL}/api/upload/progress/${jobId}`);

  source.onmessage = (event) => {
    try {
      onEvent(JSON.parse(event.data));
    } catch {
      // ignore malformed SSE frames
    }
  };

  source.onerror = () => {
    // The backend closes the connection itself on completion/error; treat
    // any other drop as a terminal error so the UI doesn't spin forever.
    onEvent({ status: "error", error: "Lost connection to processing stream" });
    source.close();
  };

  return () => source.close();
}

export function resolveAudioUrl(audioUrl: string | null): string | null {
  if (!audioUrl) return null;
  if (audioUrl.startsWith("http")) return audioUrl;
  return `${API_URL}${audioUrl}`;
}

export async function exportToNotion(meetingId: string): Promise<{ pageId: string }> {
  return request<{ pageId: string }>("/api/export/notion", {
    method: "POST",
    body: JSON.stringify({ meetingId }),
  });
}

export async function exportToSlack(meetingId: string, webhookUrl: string): Promise<void> {
  await request("/api/export/slack", {
    method: "POST",
    body: JSON.stringify({ meetingId, webhookUrl }),
  });
}

export async function exportToEmail(meetingId: string, to: string): Promise<void> {
  await request("/api/export/email", {
    method: "POST",
    body: JSON.stringify({ meetingId, to }),
  });
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  summaryLength: "CONCISE" | "STANDARD" | "DETAILED";
  emailNotifications: boolean;
}

export function getUser(userId: string): Promise<UserProfile> {
  return request<UserProfile>(`/api/users/${userId}`);
}

export function updateUser(
  userId: string,
  data: Partial<Pick<UserProfile, "name" | "summaryLength" | "emailNotifications">>
): Promise<UserProfile> {
  return request<UserProfile>(`/api/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
