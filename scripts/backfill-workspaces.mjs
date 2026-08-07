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
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
    },
  });

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
        plan: user.plan,
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

  const orphans = await prisma.meeting.count({ where: { workspaceId: null } });

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
