-- CreateEnum
CREATE TYPE "DisagreementSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Disagreement" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "severity" "DisagreementSeverity" NOT NULL DEFAULT 'MEDIUM',
    "participants" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Disagreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Disagreement_meetingId_idx" ON "Disagreement"("meetingId");

-- AddForeignKey
ALTER TABLE "Disagreement" ADD CONSTRAINT "Disagreement_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
