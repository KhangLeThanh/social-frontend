import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "./layout.content";
import React from "react";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/auth/login");
  }

  return <UserProvider>{children}</UserProvider>;
}
