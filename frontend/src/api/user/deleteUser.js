import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


export const delete_employee = async (body) => {

  const token = Cookies.get("accessToken");

  try {

    const response = await axios.delete(
      "http://localhost:3000/api_v1/user/delete",
      {
        data: body,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.log(
      "Delete employee error:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to delete employee"
    );

    return null;
  }
};