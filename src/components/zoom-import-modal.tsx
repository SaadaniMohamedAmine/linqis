"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getZoomRecordings,
  importZoomRecording,
  ApiError,
  type ZoomRecording,
  type ZoomRecordingFile,
} from "@/lib/api";

interface ZoomImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** "shared_screen_with_speaker_view" -> "Shared Screen With Speaker View" */
function fileLabel(recordingType: string): string {
  if (recordingType === "audio_only") return "Audio only";
  return recordingType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ZoomImportModal({ isOpen, onClose }: ZoomImportModalProps) {
  const [recordings, setRecordings] = useState<ZoomRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importingKey, setImportingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    getZoomRecordings(from, to)
      .then(setRecordings)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load recordings."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImport = async (recording: ZoomRecording, file: ZoomRecordingFile) => {
    const key = `${recording.id}:${file.id}`;
    setImportingKey(key);
    setError(null);
    try {
      await importZoomRecording({
        recordingId: recording.id,
        title: recording.topic,
        downloadUrl: file.download_url,
        isAudioOnly: file.recording_type === "audio_only",
      });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to import recording.");
      setImportingKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-[560px] max-h-[70vh] flex flex-col bg-surface-high border-border p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-primary">Import from Zoom</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && <p className="text-sm text-text-secondary p-4">Loading recordings...</p>}

          {!loading && error && <p className="text-sm text-danger p-4">{error}</p>}

          {!loading && !error && recordings.length === 0 && (
            <p className="text-sm text-text-secondary p-4">No cloud recordings found in the last 30 days.</p>
          )}

          {!loading && !error && recordings.map((rec) => {
            const files = rec.recording_files || [];
            const singleFile = files.length === 1 ? files[0] : null;

            return (
              <div key={rec.id} className="p-4 border-b border-border last:border-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{rec.topic}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(rec.start_time).toLocaleDateString()} · {Math.round(rec.duration)} min
                    </p>
                  </div>

                  {singleFile && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleImport(rec, singleFile)}
                      disabled={importingKey !== null}
                    >
                      {importingKey === `${rec.id}:${singleFile.id}` ? "Importing..." : "Import"}
                    </Button>
                  )}
                </div>

                {files.length === 0 && (
                  <p className="mt-2 text-xs text-text-secondary">No downloadable files for this recording.</p>
                )}

                {files.length > 1 && (
                  <div className="mt-3 flex flex-col gap-2 pl-2 border-l-2 border-border">
                    {files.map((file) => {
                      const key = `${rec.id}:${file.id}`;
                      return (
                        <div key={file.id} className="flex items-center justify-between gap-4 pl-2">
                          <span className="text-xs text-text-secondary">{fileLabel(file.recording_type)}</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleImport(rec, file)}
                            disabled={importingKey !== null}
                          >
                            {importingKey === key ? "Importing..." : "Import"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
