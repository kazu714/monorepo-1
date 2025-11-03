import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  currentUser: any; // TODO: User型に変更
};

export async function createContext({
  request,
}: {
  request: Request;
}): Promise<Context> {
  console.log("リクエストヘッダー:", request.headers);
  const authHeader = request.headers.get("authorization") ?? undefined;
  let currentUser = null;
  if (authHeader) {
    const token = authHeader?.replace(/^Bearer\s+/i, "") ?? undefined;

    const decoded = jwt.verify(token!, JWT_SECRET!);
    const sessionId = (decoded as any).sessionId;

    currentUser = await prisma.session.findFirst({
      where: { id: sessionId },
    });
    console.log("現在のユーザー:", currentUser);
  }
  return { prisma, currentUser };
}
