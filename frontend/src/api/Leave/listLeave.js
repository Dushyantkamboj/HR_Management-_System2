import axios from 'axios';
import Cookies from 'js-cookie';

export const list_leave=async(body)=>{
    const token=Cookies.get('accessToken');

    try {
        const params=new URLSearchParams({
            page:String(body.page),
            limit:String(body.limit),
            search:body.search||"",
            status:body.status||"",
        });

        const response= await axios.get(
            `http://localhost:3000/api_v1/leave/list?${params.toString()}`,
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