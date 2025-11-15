import { redirect, type LoaderFunctionArgs } from "react-router"
import { ensureSession } from "~/util/auth.server"

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await ensureSession(request)
  if(!user) return redirect("/login")
  return redirect("/todos")
}