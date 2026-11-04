import axios from 'axios';
import Cookies from 'js-cookie';

export const list_attendance = async(body)=>{
    const token=Cookies.get('accessToken');

    try {
        const response= await axios.get(
            "http://localhost:3000/api_v1/attendance/list",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                },
                data: body
            }
        )

        console.log('response:',response);

        return response;

    } catch (error) {
        console.log("error:", error);
        console.log("backend error:", error.response?.data);
    }
}