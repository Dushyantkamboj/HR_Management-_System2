
import axios from "axios";
import Cookies from "js-cookie";

export const list_event = async (page = 1, limit = 10) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.get(
      `http://localhost:3000/api_v1/event/list?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
};