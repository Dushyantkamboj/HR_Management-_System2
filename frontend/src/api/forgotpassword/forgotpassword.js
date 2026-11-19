import axios from "axios";

const API_URL = "http://localhost:3000/api_v1/user";

const post = async (path, body) => {
  try {
    const response = await axios.post(`${API_URL}${path}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    // Surface the backend's validation/business message to the UI.
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.",
      { cause: error },
    );
  }
};

export const forgot_password = async (data) => post("/forgotpassword", data);

export const verify_reset_token = async (data) => post("/verifyresettoken", data);

export const reset_password = async (data) => post("/resetpassword", data);
