-- Second half of the workspace migration. Only safe to run AFTER
-- scripts/backfill-workspaces.mjs has reported 0 meetings without a
-- workspace -- it is what makes the NOT NULL below possible.

-- Meeting.workspaceId becomes mandatory (the backfill filled 100% of rows).
-- The foreign key was already created in 20260807171515_add_workspaces.
ALTER TABLE "Meeting" ALTER COLUMN "workspaceId" SET NOT NULL;

-- Query pattern is now "meetings of a workspace", so the userId/status
-- indexes are replaced by workspace-scoped ones.
DROP INDEX IF EXISTS "Meeting_userId_idx";
DROP INDEX IF EXISTS "Meeting_status_idx";
CREATE INDEX "Meeting_workspaceId_idx" ON "Meeting"("workspaceId");
CREATE INDEX "Meeting_workspaceId_status_idx" ON "Meeting"("workspaceId", "status");

-- User: billing columns moved to Workspace (values copied by the backfill).
ALTER TABLE "User" DROP COLUMN "plan";
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";
ALTER TABLE "User" DROP COLUMN "stripeSubscriptionId";
ALTER TABLE "User" DROP COLUMN "subscriptionStatus";
ALTER TABLE "User" DROP COLUMN "currentPeriodEnd";
