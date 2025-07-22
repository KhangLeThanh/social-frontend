import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";

export const getUsers = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  try {
    const response = await axios.get(
      `${APIURL}/users/?limit=${limit}&offset=${offset}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const getUser = async ({ userId }: { userId: number }) => {
  try {
    const response = await axios.get(`${APIURL}/users/${userId}`, {
      withCredentials: true,
    });
    return response.data[0];
  } catch (error: any) {
    console.log("test error", error);
  }
};

export const searchUser = async ({
  userName,
  limit,
  offset,
}: {
  userName: string;
  limit?: number;
  offset?: number;
}) => {
  try {
    const response = await axios.get(
      `${APIURL}/users/search?userName=${userName}&limit=${limit}&offset=${offset}`,
      {
        withCredentials: true,
      }
    );
    return response.data ?? [];
  } catch (error: any) {
    console.log("test error", error);
  }
};
