import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


export const change_employee_password = async (body) => {

  const token = Cookies.get("accessToken");

  try {

    const response = await axios.patch(
      "http://localhost:3000/api_v1/user/changepassword",
      body,
      {
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