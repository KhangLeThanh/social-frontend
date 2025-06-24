// /app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (token) {
    redirect("/content/dashboard");
  } else {
    redirect("/auth/login");
  }

  return null;
}
