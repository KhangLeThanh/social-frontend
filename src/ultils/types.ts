export type UserName = {
  username: string;
  password: string;
  id: number;
};

export type PostResponse = {
  id?: number;
  content: string;
  userId: number;
};

export type Post = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  userId: number;
};

export type ErrorResponse = {
  message: string;
};
