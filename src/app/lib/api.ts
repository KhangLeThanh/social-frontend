// lib/api.ts
import { ReactNode } from "react";
import { cookies } from "next/headers";

export async function fetchWithAuth(
  url: string
): Promise<{ data?: unknown; error?: ReactNode }> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token") ?? cookieStore.get("jwt");

  if (!tokenCookie) {
    return { error: "No JWT token found in cookies." };
  }

  const jwtToken = tokenCookie.value;

  const res = await fetch(url, {
    headers: {
      cookie: `token=${jwtToken}`,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const errorMessage = errorData?.error || "Unknown error";
    return { error: errorMessage };
  }

  const data = await res.json();
  return { data };
}
