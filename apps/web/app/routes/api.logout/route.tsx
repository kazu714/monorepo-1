import type { ActionFunctionArgs } from "react-router";
import { ensureSession, logout } from "~/util/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  await ensureSession(request);
  return await logout(request);
};