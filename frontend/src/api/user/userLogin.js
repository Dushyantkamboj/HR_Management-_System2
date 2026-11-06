// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// export const employee_login = async (email, password) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/api_v1/user/login",
//       {
//         email: email,
//         password: password,
//       },
//     );

//     // console.log('response:',response);

//     if (response.data.status) {
//       Cookies.set("accessToken", response.data.data.accessToken);
//       Cookies.set("refreshToken", response.data.data.refreshToken);
//       Cookies.set("type", response.data.data.type);
//       Cookies.set("name", response.data.data.name);
//       Cookies.set('email',response.data.data.email)

//       const data = { value: true, response: response };

//       return data;
//     }

//     return false;
    
//   } catch (error) {
//     console.log(error.response?.data.message);

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
//     return false;
//   }
// };




import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const employee_login = async (email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/login`,
      {
        email: email,
        password: password,
      }
    );

    if (response.data.status) {
      Cookies.set("accessToken", response.data.data.accessToken);
      Cookies.set("refreshToken", response.data.data.refreshToken);
      Cookies.set("type", response.data.data.type);
      Cookies.set("name", response.data.data.name);
      Cookies.set("email", response.data.data.email);

      return {
        value: true,
        response: response
      };
    }

    return false;

  } catch (error) {
    console.log(error.response?.data?.message);

    toast.error(error.response?.data?.message || "Login failed", {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });

    return false;
  }
};
