import axios from 'axios';
import Cookies from 'js-cookie';

export const add_attendance = async(body)=>{
    const token=Cookies.get('accessToken');

    try {
        const response= await axios.post(
            "http://localhost:3000/api_v1/attendance/add",
            body,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )

        return response;

    } catch (error) {
        console.log("error:", error);
        console.log("backend error:", error.response?.data);
    }
}