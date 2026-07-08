import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  // SQLite Vercel Workaround: Copy read-only database to writable /tmp directory
  const dbName = "dev.db";
  const sourcePath = path.join(process.cwd(), "prisma", dbName);
  const destPath = path.join("/tmp", dbName);

  try {
    if (!fs.existsSync(destPath)) {
      console.log(`Copying database from ${sourcePath} to ${destPath}`);
      fs.copyFileSync(sourcePath, destPath);
      console.log("Database successfully copied to /tmp!");
    } else {
      console.log("Database already exists in /tmp");
    }
  } catch (error) {
    console.error("Failed to copy database to /tmp:", error);
  }

  // Instruct Prisma to read/write to the /tmp SQLite database
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${destPath}`
      }
    }
  });
} else {
  // In development, prevent duplicate connections during Next.js hot-reloading
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
