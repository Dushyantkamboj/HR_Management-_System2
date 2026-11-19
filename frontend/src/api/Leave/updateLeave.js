import axios from 'axios';
import Cookies from 'js-cookie';

// Update a leave request. Only pending, own requests are accepted by the server.
export const update_leave = async (body) => {
  const token = Cookies.get('accessToken');

  try {
    const response = await axios.patch(
      'http://localhost:3000/api_v1/leave/edit',
      body,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Unable to update leave',
      { cause: error },
    );
  }
};
