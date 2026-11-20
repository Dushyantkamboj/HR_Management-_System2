// import axios from "axios"
// import Cookies from 'js-cookie'

// export const  list_employee=async(page,limit)=>{
//     const Token=Cookies.get('accessToken')

//     try {
//         const response = await axios.get(
//             `http://localhost:3000/api_v1/user/list?page=${page}&limit=${limit}`,
//             {
//                 headers:{
//                     authorization:`Bearer ${Token}`
//                 }
//             }
//         )
        
//         return response.data;

//     } catch (error) {
//         return error
//     }
// }




import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


export const list_employee = async (
  page,
  limit,
  search = "",
  department = "",
  status = ""
) => {

  const token = Cookies.get("accessToken");

  try {

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search || "",
      department: department || "",
      status: status || "",
    });

    const response = await axios.get(
      `http://localhost:3000/api_v1/user/list?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.log(
      "List employee error:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
      "Unable to fetch employees"
    );

    return null;
  }
};
