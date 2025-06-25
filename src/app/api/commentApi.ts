import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";
import { CommentResponse } from "@/ultils/types";

export const createComment = async (comment: CommentResponse) => {
  try {
    const response = await axios.post(`${APIURL}/comments`, comment, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const updateComment = async ({
  commentId,
  content,
}: {
  commentId: number;
  content: string;
}) => {
  try {
    const response = await axios.patch(
      `${APIURL}/comments/${commentId}`,
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

export const getComment = async ({ postId }: { postId: number }) => {
  try {
    const response = await axios.get(`${APIURL}/comments/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const deleteComment = async ({ commentId }: { commentId: number }) => {
  try {
    const response = await axios.delete(`${APIURL}/comments/${commentId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};
