import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { PostResponse } from "@/ultils/types";

export const getPosts = async () => {
  try {
    const response = await axios.get(`${APIURL}/posts`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
export const getOnePost = async (postId: number) => {
  try {
    const response = await axios.get(`${APIURL}/posts/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
export const createPost = async (post: PostResponse) => {
  try {
    const response = await axios.post(`${APIURL}/posts`, post, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
export const updatePost = async ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) => {
  try {
    const response = await axios.patch(
      `${APIURL}/posts/${postId}`,
      { content },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const deletePost = async (postId: number) => {
  try {
    const response = await axios.delete(`${APIURL}/posts/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const getPersonalPost = async (userId: number) => {
  try {
    const response = await axios.get(
      `${APIURL}/posts/personal?userId=${userId}`,
      {
        withCredentials: true,
      }
    );
    console.log("test response", response);
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
