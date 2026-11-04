import axios from "axios";
import Cookies from "js-cookie";

export const delete_event = async (eventId) => {
  const token = Cookies.get("accessToken");

  try {
    const response = await axios.delete(
      "http://localhost:3000/api_v1/event/delete",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          eventId: eventId,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
};