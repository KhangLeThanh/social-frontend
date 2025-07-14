import { StatusFriendRequest } from "./enum";

export type UserName = {
  username: string;
  password: string;
  id: number;
};

export type PostResponse = {
  id?: number;
  content: string;
  userId: number;
  postUserId: number | null;
};

export type Post = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  userId: number;
};
export type PostProfile = Post & {
  authorUsername: string;
  receiverUsername: string;
  postUserId: number;
};
export type ErrorResponse = {
  message: string;
};

export type CommentResponse = {
  id?: number;
  content: string;
  userId: number;
  postId: number;
};

export type Comment = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  userId: number;
  postId: number;
};

export type ChatResponse = {
  senderId: number;
  receiverId: number;
};

export type MessageResponse = {
  content: string;
  userId: number;
  chatId: number;
};

export type Message = {
  content: string;
  username: string;
  id: number;
  chatId: number;
};
export type FriendRequestResponse = ChatResponse & {
  status: StatusFriendRequest;
};
