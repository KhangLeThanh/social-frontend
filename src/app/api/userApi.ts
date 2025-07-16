import axios from "axios";
import { APIURL } from "@/app/constant/baseUrl";

export const getUsers = async () => {
  try {
    const response = await axios.get(`${APIURL}/users`, {
      withCredentials: true,
    });
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

export const searchUser = async ({ userName }: { userName: string }) => {
  try {
    const response = await axios.get(
      `${APIURL}/users/search?userName=${userName}`,
      {
        withCredentials: true,
      }
    );
    return response.data ?? [];
  } catch (error: any) {
    console.log("test error", error);
  }
};
