-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Meeting" ADD COLUMN "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_shareToken_key" ON "Meeting"("shareToken");
