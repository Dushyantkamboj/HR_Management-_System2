import axios from 'axios';
import Cookies from 'js-cookie';

export const on_leave_today = async () => {
    const token = Cookies.get('accessToken');

    try {
        const response = await axios.get(
            'http://localhost:3000/api_v1/leave/on-leave-today',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.log('On leave today error:', error.response?.data || error);
        return null;
    }
};
