import bcrypt from "bcrypt";
import { connectDataBase } from "../database/database.js";
import { ObjectId } from "mongodb";
import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";
import { access_token, refresh_token } from "../utils/JWT.js";
import { transporter } from "../utils/sendEmail.js";
import crypto from 'crypto';


export const employee_details_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const datatype = payload.datatype;

    const condition = {
      is_deleted: false,
    };

    switch (datatype) {
      case "email":
        condition.email = payload.email;
        break;

      case "employeeId":
        condition._id = new ObjectId(payload.employeeId);
        break;

      default:
        condition._id = new ObjectId(payload.userId);
        break;
    }

    const employeeExist = await users.findOne(condition);

    if (!employeeExist) {
      return {
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.notExistUser,
      };
    }

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.existUser,
      data: employeeExist,
    };

  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const list_employee_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const page = parseInt(payload.page) || 1;
    const limit = parseInt(payload.limit) || 10;

    const skip = (page - 1) * limit;

    const condition = {
      is_deleted: false,
      type: { $ne: 1 },
    };

    const totalEmployee = await users.countDocuments(condition);

    const userList = await users
      .find(condition)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalEmployee / limit);

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: "userList",

      data: {
        employees: userList,

        pagination: {
          currentPage: page,
          limit: limit,
          totalEmployees: totalEmployee,
          totalPages: totalPages,
        },
      },
    };
    
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const add_employee_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const data = {
      _id: new ObjectId(),
      name: payload.name,
      email: payload.email,
      department: payload.department,
      phone: payload.phone,
      password: hashedPassword,
      location: payload.location,
      joining_date: payload.joining_date,
      status: payload.status,
      type: payload.type,
      salary: payload.salary,
      is_deleted: false,
      created_at: Date.now(),
      updated_at: Date.now(),
      created_by: new ObjectId(payload.userId),
      updated_by: new ObjectId(payload.userId),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    };

    await users.insertOne(data);

    return {
      status: 1,
      status_code: status_code.CREATED,
      message: response_message.newUser,
      data: data,
    };

  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const update_employee_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const data = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      department: payload.department,
      status: payload.status,
      type: payload.type,
      joining_date: payload.joining_date,
      salary: payload.salary,
      updated_at: Date.now(),
      updated_by: new ObjectId(payload.userId),

    };

    const result = await users.updateOne(
      {
        _id: new ObjectId(payload.employeeId),
        is_deleted: false,
      },
      {
        $set: data,
      },
    );

    if (result.matchedCount === 0) {
      return {
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.notExistUser,
      };
    }

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.updateData,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const delete_employee_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const result = await users.updateOne(
      {
        _id: new ObjectId(payload.employeeId),
        is_deleted: false,
      },
      {
        $set: {
          is_deleted: true,
          updated_at: Date.now(),
          updated_by: new ObjectId(payload.userId),
        },
      },
    );

    if (result.matchedCount === 0) {
      return {
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.notExistUser,
      };
    }

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.deleteUserData,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const employee_login_service = async (payload) => {
  try {

    const matchedPassword = await bcrypt.compare(
      payload.password,
      payload.data.password,
    );

    if (!matchedPassword) {
      return {
        status: 0,
        status_code: status_code.UNAUTHORIZED,
        message: response_message.passwordNotMatch,
      };
    }

    const data = {
      userId: payload.data._id,
      name: payload.data.name,
      type: payload.data.type,
      status: payload.data.status,
    };

    const accessToken = await access_token(data);
    const refreshToken = await refresh_token(data);

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.loginSuccess,

      data: {
        type: data.type,
        name: data.name,
        email: payload.email,
        accessToken: accessToken,
        refreshToken: refreshToken,

        status: data.status,
      },
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const employee_change_password_service = async (payload) => {
  try {

    const db = await connectDataBase();
    const users = db.collection("users");

    const isMatch = await bcrypt.compare(
      payload.current_password,
      payload.data.password,

    );

    if (!isMatch) {
      return {
        status: 0,
        status_code: status_code.BAD_REQUEST,
        message: response_message.wrongPassword,
      };
    }

    const isSame = await bcrypt.compare(
      payload.new_password,
      payload.data.password,

    );

    if (isSame) {
      return {
        status: 0,
        status_code: status_code.BAD_REQUEST,
        message: response_message.samePassword,
      };
    }

    const hashedPassword = await bcrypt.hash(payload.new_password, 10);

    await users.updateOne(
      { _id: payload.data._id },
      { $set: { password: hashedPassword } },

    );

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.passwordChanged,
    };
  } catch (error) {
    return {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const forgot_password_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const user = payload.data;
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
          updated_at: Date.now(),
        },
      },
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}?email=${encodeURIComponent(payload.email)}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: payload.email,
      subject: "PeopleCore HR - Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0F172A">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset the password for your account. Click the button below to choose a new password.</p>
          <p style="margin:28px 0">
            <a href="${resetUrl}" style="background:#6C63FF;color:#ffffff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block">Reset Password</a>
          </p>
          <p style="color:#64748B;font-size:13px">This link expires in 15 minutes. If you didn't request it, you can safely ignore this email.</p>
          <p style="color:#94A3B8;font-size:12px;word-break:break-all">${resetUrl}</p>
        </div>
      `,
    });

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: "Password reset link sent successfully",
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const verify_reset_token_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const user = await users.findOne({
      email: payload.email,
      resetPasswordToken: { $ne: null, $exists: true },
      resetPasswordExpires: { $gt: new Date() },
      is_deleted: false,
    });

    const valid = user && await bcrypt.compare(payload.token, user.resetPasswordToken);

    if (!valid) {
      return {
        status: 0,
        status_code: status_code.BAD_REQUEST,
        message: "Reset link is invalid or has expired",
      };
    }

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: "Reset link is valid",
      data: { email: payload.email },
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};

export const reset_password_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const invalidLink = {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: "Reset link is invalid or has expired",
    };

    // Narrow the lookup with the email from the link, then verify the
    // raw token against its stored hash below.
    const user = await users.findOne({
      email: payload.email,
      resetPasswordToken: { $ne: null, $exists: true },
      resetPasswordExpires: { $gt: new Date() },
      is_deleted: false,
    });

    if (!user || !user.resetPasswordToken) {
      return invalidLink;
    }

    const tokenMatches = await bcrypt.compare(
      payload.token,
      user.resetPasswordToken,
    );

    if (!tokenMatches) {
      return invalidLink;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          updated_at: Date.now(),
        },
      },
    );

    return {
      status: 1,
      status_code: status_code.SUCCESS,
      message: response_message.passwordChanged,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    };
  }
};
