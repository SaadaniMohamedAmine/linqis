/**
 * One-shot backfill, run exactly once between the `add_workspaces` migration
 * (adds a nullable Meeting.workspaceId) and `finalize_workspaces` (makes it
 * NOT NULL and drops the billing columns from User).
 *
 * Gives every pre-existing user a personal workspace they OWN, carries their
 * billing state over to it, and re-points all of their meetings at it.
 *
 *   npx tsx scripts/backfill-workspaces.mjs
 *
 * Idempotent: a user who already has a workspace membership is skipped, so a
 * re-run after a partial failure only finishes the remaining users.
 *
 * NOTE ON RAW SQL: this script runs against the *intermediate* database shape
 * (User still has its billing columns, Meeting.workspaceId is still nullable),
 * but the Prisma client on disk is generated from the *final* schema, where
 * neither is true. Any query touching those two things therefore has to be raw
 * SQL -- a typed query would throw PrismaClientValidationError. The writes
 * below can stay typed because Workspace/WorkspaceMember are identical in both
 * shapes and setting Meeting.workspaceId to a string is valid either way.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Raw: "plan" and the four stripe/subscription columns are dropped by the
  // finalize_workspaces migration, so they don't exist on the generated client.
  const users = await prisma.$queryRaw`
    SELECT
      "id",
      "name",
      "email",
      "plan"::text AS "plan",
      "stripeCustomerId",
      "stripeSubscriptionId",
      "subscriptionStatus",
      "currentPeriodEnd"
    FROM "User"
  `;

  console.log(`Backfilling ${users.length} personal workspaces...`);

  let created = 0;
  let skipped = 0;
  let meetingsMoved = 0;

  for (const user of users) {
    const existing = await prisma.workspaceMember.findFirst({ where: { userId: user.id } });
    if (existing) {
      skipped++;
      console.log(`  ${user.email} -> already a member of ${existing.workspaceId}, skipped`);
      continue;
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: user.name ? `${user.name}'s Workspace` : "My Workspace",
        ownerId: user.id,
        // Raw SQL hands this back as a plain string ('FREE' | 'PRO'), which is
        // exactly what Prisma expects for the Plan enum.
        plan: user.plan || "FREE",
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodEnd: user.currentPeriodEnd,
      },
    });

    await prisma.workspaceMember.create({
      data: { workspaceId: workspace.id, userId: user.id, role: "OWNER" },
    });

    const moved = await prisma.meeting.updateMany({
      where: { userId: user.id },
      data: { workspaceId: workspace.id },
    });

    created++;
    meetingsMoved += moved.count;
    console.log(`  ${user.email} -> workspace ${workspace.id} (${moved.count} meeting(s) moved)`);
  }

  // Raw: Meeting.workspaceId is non-nullable on the final schema, so the
  // generated client rejects `{ workspaceId: null }` as a filter outright.
  const [{ orphans }] = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS "orphans" FROM "Meeting" WHERE "workspaceId" IS NULL
  `;

  console.log(
    `Done. ${created} workspace(s) created, ${skipped} skipped, ${meetingsMoved} meeting(s) moved.`
  );
  console.log(`Meetings still without a workspace: ${orphans}`);

  if (orphans > 0) {
    console.error(
      "ABORT: some meetings have no workspace. Do NOT run the finalize_workspaces migration until this is 0."
    );
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
