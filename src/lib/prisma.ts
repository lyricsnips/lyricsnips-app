// Import the PrismaClient constructor from the Prisma package
import { PrismaClient } from "@prisma/client";

// Attach PrismaClient to the global object to prevent multiple instances in development
// The double type assertion (as unknown as) bypasses TypeScript's strict type checking
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the existing PrismaClient instance if it exists, otherwise create a new one
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, always reuse the same PrismaClient instance to avoid exhausting database connections
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
 