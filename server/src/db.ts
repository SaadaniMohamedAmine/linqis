import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });

  globalForPrisma.prisma = new PrismaClient({ adapter });
  return globalForPrisma.prisma;
}
