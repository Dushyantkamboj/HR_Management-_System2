// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// export const add_employee = async (body) => {
//   const token = Cookies.get("accessToken");

//   try {
//     const response = await axios.post(
//       "http://localhost:3000/api_v1/user/add",
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     return response.data;
//   } catch (error) {
//     console.log("error:", error.message);

//     toast.error(error.response?.data.message, {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: false,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "colored",
//     });
//   }
// };






import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


export const add_employee = async (body) => {

  const token = Cookies.get("accessToken");

  try {

    const response = await axios.post(
      "http://localhost:3000/api_v1/user/add",
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
      "Add employee error:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to add employee"
    );

    return null;
  }
};