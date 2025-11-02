import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  sessionId: string | undefined;
};

export function createContext({ request }: { request: Request }): Context {
  const authHeader = request.headers.get("authorization") ?? undefined;
  const sessionId = authHeader?.replace(/^Bearer\s+/i, "") ?? undefined;
  return { prisma, sessionId };
}
