export interface TranscriptSegment {
  speaker: string;
  timestamp: string;
  content: string;
}

export async function diarizeSpeakers(
  segments: TranscriptSegment[]
): Promise<TranscriptSegment[]> {
  // Simple heuristic-based diarization
  // In production, replace with pyannote.audio or Hugging Face diarization model

  const speakerLabels = ["Speaker 1", "Speaker 2", "Speaker 3", "Speaker 4"];
  let currentSpeaker = 0;
  const diarized: TranscriptSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prevSeg = diarized[diarized.length - 1];

    // Detect speaker change based on content patterns
    const shouldChangeSpeaker = detectSpeakerChange(seg, prevSeg, i);

    if (shouldChangeSpeaker) {
      currentSpeaker = (currentSpeaker + 1) % speakerLabels.length;
    }

    diarized.push({
      ...seg,
      speaker: speakerLabels[currentSpeaker],
    });
  }

  return diarized;
}

function detectSpeakerChange(
  current: TranscriptSegment,
  previous: TranscriptSegment | undefined,
  index: number
): boolean {
  if (!previous) return false;

  // Heuristic: change speaker if:
  // 1. Long pause (timestamp gap > 2 minutes)
  const timeGap = parseTimestamp(current.timestamp) - parseTimestamp(previous.timestamp);
  if (timeGap > 120) return true;

  // 2. Every 5-7 segments (approximate rotation)
  if (index % 6 === 0 && index > 0) return true;

  // 3. Content shift (questions vs statements)
  const isQuestion = current.content.trim().endsWith("?");
  const wasStatement = !previous.content.trim().endsWith("?");
  if (isQuestion && wasStatement && index % 3 === 0) return true;

  return false;
}

function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}
