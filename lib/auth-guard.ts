import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export async function requireAdmin() {
  const session = await auth();

  if (!isAdmin(session?.user?.email)) {
    redirect("/unauthorized");
  }
}
