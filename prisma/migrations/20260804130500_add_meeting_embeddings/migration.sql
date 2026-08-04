-- CreateTable
CREATE TABLE "MeetingEmbedding" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeetingEmbedding_meetingId_idx" ON "MeetingEmbedding"("meetingId");

-- AddForeignKey
ALTER TABLE "MeetingEmbedding" ADD CONSTRAINT "MeetingEmbedding_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
