"use client";
import React from "react";
import { useUser } from "../layout.content";
import ContentPost from "./ContentPost";
import PostForm from "@/app/content/sharedcomponents/PostForm";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <main>
      {user && <PostForm userId={user.id} authorName={user?.username} />}
      <ContentPost userId={user?.id} />
    </main>
  );
}
