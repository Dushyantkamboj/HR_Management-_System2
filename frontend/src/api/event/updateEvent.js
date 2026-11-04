import axios from "axios";
import Cookies from "js-cookie";

export const update_event = async (eventData) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.patch(
      "http://localhost:3000/api_v1/event/update",
      eventData,
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