// import bcrypt from "bcrypt";
// import { connectDataBase } from "../database/database.js";
// import { ObjectId } from "mongodb";
// import { status_code } from "../utils/constant.js";
// import { response_message } from "../utils/responseMessage.js";
// import { access_token, refresh_token } from "../utils/JWT.js";

// export const employee_details_service = async (payload) => {

//   try {
//     const db = await connectDataBase();
//     const users = db.collection("users");
//     const datatype = payload.datatype;

//     const condition = {
//       is_deleted: false,
//       status: 1,
//     };

//     switch (datatype) {
//       case "email":
//         condition.email = payload.email;
//         break;

//       case "employeeId":
//         condition._id = new ObjectId(payload.employeeId);
//         break;

//       default:
//         condition._id = new ObjectId(payload.userId);
//         break;
//     }

//     const employeeExist = await users.findOne(condition);

//     if (!employeeExist) {
//       return {
//         status: 0,
//         status_code: status_code.NOT_FOUND,
//         message: response_message.notExistUser,
//       };
//     }

//     return {
//       status: 1,
//       status_code: status_code.SUCCESS,
//       message: response_message.existUser,
//       data: employeeExist,
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };

// export const list_employee_service = async (payload) => {

//   try {
//     const db = await connectDataBase();
//     const users = db.collection("users");

//     const page = parseInt(payload.page) || 1;
//     const limit = parseInt(payload.limit) || 10;

//     const skip = (page - 1) * limit;

//     const condition = {
//       is_deleted: false,
//       type: { $ne: 1 },
//     };

//     const totalEmployee = await users.countDocuments(condition);

//     const userList = await users
//       .find(condition)
//       .sort({ created_at: -1 })
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const totalPages = Math.ceil(totalEmployee / limit);

//     return {
//       status: 1,
//       status_code: status_code.SUCCESS,
//       message: "userList",
//       data: {
//         employees: userList,
//         pagination: {
//           currentPage: page,
//           limit: limit,
//           totalEmployees: totalEmployee,
//           totalPages: totalPages,
//         },
//       },
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };

// export const add_employee_service = async (payload) => {

//   try {
//     const db = await connectDataBase();
//     const users = db.collection("users");

//     const hashedPassword = await bcrypt.hash(payload.password, 12);

//     const data = {
//       _id:new ObjectId(),
//       name: payload.name,
//       email: payload.email,
//       department: payload.department,
//       phone: payload.phone,
//       password: hashedPassword,
//       location: payload.location,
//       joining_date: payload.joining_date,
//       status: payload.status,
//       type: payload.type,
//       salary: payload.salary,
//       is_deleted: false,
//       created_at: Date.now(),
//       updated_at: Date.now(),
//       created_by: new ObjectId(payload.userId),
//       updated_by: new ObjectId(payload.userId),
//     };

//     await users.insertOne(data);
//     return {
//       status: 1,
//       status_code: status_code.CREATED,
//       message: response_message.newUser,
//       data:payload._id
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };

// export const update_employee_service = async (payload) => {
//   try {
//     const db = await connectDataBase();
//     const users = db.collection("users");

//     const data = {
//       name: payload.name,
//       age: payload.age,
//       email: payload.email,
//       phone: payload.phone,
//       location: payload.location,
//       status: payload.status,
//       type: payload.type,
//       joined: payload.joined,
//       is_deleted: false,
//       updated_at: Date.now(),
//       updated_by: new ObjectId(payload.userId),
//     };

//     await users.updateOne(
//       { _id: new ObjectId(payload.employeeId) },
//       { $set: data },
//     );
//     return {
//       status: 1,
//       status_code: status_code.SUCCESS,
//       message: response_message.updateData,
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };

// export const delete_employee_service = async (payload) => {
//   console.log("payload:", payload);

//   try {
//     const db = await connectDataBase();
//     const users = db.collection("users");

//     await users.updateOne(
//       { _id: new ObjectId(payload.employeeId) },
//       { $set: { is_deleted: true } },
//     );
//     return {
//       status: 1,
//       status_code: status_code.SUCCESS,
//       message: response_message.deleteUserData,
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };

// export const employee_login_service = async (payload) => {
//   try {
    
//     const matchedPassword = await bcrypt.compare(
//       payload.password,
//       payload.data.password,
//     );

//     if (!matchedPassword) {
//       return {
//         status: 0,
//         status_code: status_code.UNAUTHORIZED,
//         message: response_message.passwordNotMatch,
//       };
//     }

//     const data = {
//       userId: payload.data._id,
//       name: payload.data.name,
//       type: payload.data.type,
//       status: payload.data.status,
//     };

//     const accessToken = await access_token(data);
//     const refreshToken = await refresh_token(data);

//     return {
//       status: 1,
//       status_code: status_code.SUCCESS,
//       message: response_message.loginSuccess,
//       data: {
//         type: data.type,
//         name: data.name,
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//         status: data.status,
//       },
//     };
//   } catch (error) {
//     throw {
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     };
//   }
// };






import bcrypt from "bcrypt";
import { connectDataBase } from "../database/database.js";
import { ObjectId } from "mongodb";
import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";
import { access_token, refresh_token } from "../utils/JWT.js";


// ======================================================
// GET SINGLE EMPLOYEE / USER
// ======================================================

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


// ======================================================
// LIST EMPLOYEES
// ======================================================

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


// ======================================================
// ADD EMPLOYEE
// ======================================================

export const add_employee_service = async (payload) => {
  try {
    const db = await connectDataBase();
    const users = db.collection("users");

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const employeeId = new ObjectId();

    const data = {
      _id: employeeId,

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


// ======================================================
// UPDATE EMPLOYEE
// ======================================================

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
      }
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


// ======================================================
// DELETE EMPLOYEE
// ======================================================

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
      }
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


// ======================================================
// LOGIN
// ======================================================

export const employee_login_service = async (payload) => {
  try {

    console.log('payload:',payload);

    const matchedPassword = await bcrypt.compare(
      payload.password,
      payload.data.password
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
        email:payload.email,
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

    console.log('payload:',payload);
    

    const db=await connectDataBase()
    const users=db.collection('users')

    // 1. Check current password
    const isMatch = await bcrypt.compare(
      payload.current_password,
      payload.data.password
    );

    if (!isMatch) {

      return {
        status: 0,
        status_code: status_code.BAD_REQUEST,
        message: response_message.wrongPassword,
      };

    }

    // console.log("hgtyu");
    

    // 2. New password must be different from the current one
    const isSame = await bcrypt.compare(
      payload.new_password,
      payload.data.password
    );

    if (isSame) {

      return {
        status: 0,
        status_code: status_code.BAD_REQUEST,
        message: response_message.samePassword,
      };

    }

    // 3. Hash and save the new password
    const hashedPassword = await bcrypt.hash(payload.new_password, 10);

    await users.updateOne({ _id: payload.data._id },{$set:{ password: hashedPassword}});

    // 4. Success
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