-- CreateEnum
CREATE TYPE "SummaryLength" AS ENUM ('CONCISE', 'STANDARD', 'DETAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "summaryLength" "SummaryLength" NOT NULL DEFAULT 'STANDARD';
ALTER TABLE "User" ADD COLUMN "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
