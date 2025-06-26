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
