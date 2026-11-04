import axios from 'axios';
import Cookies from 'js-cookie';

export const list_leave=async(body)=>{
    const token=Cookies.get('accessToken');
    console.log('token:',token);

    try {
        const response= await axios.get(
            `http://localhost:3000/api_v1/leave/list?page=${body.page}&limit=${body.limit}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )

        console.log('response:',response);
        
        return response;

    } catch (error) {
           console.log("error:", error);
    console.log("backend error:", error.response?.data);
    }
}