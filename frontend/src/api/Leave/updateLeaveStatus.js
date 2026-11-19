import axios from 'axios';
import Cookies from 'js-cookie';

// Admin / HR approve (2) or reject (3) a leave request.
export const update_leave_status = async ({ id, status }) => {
  const token = Cookies.get('accessToken');

  try {
    const response = await axios.patch(
      'http://localhost:3000/api_v1/leave/status',
      { id, status },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Unable to update leave status',
      { cause: error },
    );
  }
};
