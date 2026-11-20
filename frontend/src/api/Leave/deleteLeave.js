import axios from 'axios';
import Cookies from 'js-cookie';

export const delete_leave = async (leaveId) => {
    const token = Cookies.get('accessToken');

    try {
        const response = await axios.delete(
            'http://localhost:3000/api_v1/leave/delete',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    id: leaveId
                }
            }
        );

        return response;
    } catch (error) {
        console.log("error:", error);
        throw error;
    }
};
