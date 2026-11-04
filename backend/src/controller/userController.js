// import { status_code } from "../utils/constant.js";
// import { response_message } from "../utils/responseMessage.js";
// import {
//   list_employee_service,
//   add_employee_service,
//   employee_details_service,
//   update_employee_service,
//   delete_employee_service,
//   employee_login_service
// } from "../services/userService.js";

// export const list_employee_controller = async (req, res) => {
//   try {
//     const query = {
//       ...req.query,
//     };

//     const response = await list_employee_service(query);
//     return res.status(response.status_code).json(response);
//   } catch (error) {
//     return res.status(status_code.BAD_REQUEST).json({
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     });
//   }
// };

// export const add_employee_controller = async (req, res) => {
  
//   try {
//     const body = {
//       ...req.user,
//       ...req.body,
//       datatype: "email",
//     };

//     const employeeDetails = await employee_details_service(body);

//     if (employeeDetails.status) {
//       return res.status(status_code.CONFLICT).json({
//         status: 0,
//         status_code: status_code.CONFLICT,
//         message: response_message.alreadyExists,
//       });
//     }

//     const response = await add_employee_service(body);
//     return res.status(response.status_code).json(response);
//   } catch (error) {
//     return res.status(status_code.BAD_REQUEST).json({
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     });
//   }
// };

// export const update_employee_controller = async (req, res) => {
//   try {
//     const body = {
//       ...req.user,
//       ...req.body,
//       datatype: "employeeId",
//     };

//     const employeeDetails = await employee_details_service(body);

//     if (!employeeDetails.status) {
//       return res.status(status_code.CONFLICT).json({
//         status: 0,
//         status_code: status_code.CONFLICT,
//         message: response_message.notExistUser,
//       });
//     }

//     const response = await update_employee_service(body);
//     return res.status(response.status_code).json(response);
//   } catch (error) {
//     return res.status(status_code.BAD_REQUEST).json({
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     });
//   }
// };

// export const delete_employee_controller = async (req, res) => {
//   try {
//     const body = {
//       ...req.user,
//       ...req.body,
//       type: "employeeId",
//     };
//     const employeeDetails = await employee_details_service(body);
//     if (!employeeDetails.status) {
//       return res.status(status_code.CONFLICT).json({
//         status: 0,
//         status_code: status_code.CONFLICT,
//         message: response_message.notExistUser,
//       });
//     }
//     const response = await delete_employee_service(body);
//     return res.status(response.status_code).json(response);
//   } catch (error) {
//     return res.status(status_code.BAD_REQUEST).json({
//       status: 0,
//       status_code: status_code.BAD_REQUEST,
//       message: error.message,
//     });
//   }
// };


// export const login_employee_controller=async(req,res)=>{
//   try {
//     const body={
//       ...req.body,
//       datatype:"email"
//     }
    
//     const userExist=await employee_details_service(body)
//     if(!userExist.status){
//       return res.status(status_code.CONFLICT).json({
//         status:0,
//         status_code:status_code.CONFLICT,
//         message:response_message.notExistUser
//       })
//     }

//     const data={
//       ...req.body,
//       ...userExist
//     }

//     const response=await employee_login_service(data)
//     return res.status(response.status_code).json(response)
//   } catch (error) {
//     return res.status(status_code.BAD_REQUEST).json({
//       status:0,
//       status_code:status_code.BAD_REQUEST,
//       message:error.message
//     })
//   }
// }



import { status_code } from "../utils/constant.js";
import { response_message } from "../utils/responseMessage.js";

import {
  list_employee_service,
  add_employee_service,
  employee_details_service,
  update_employee_service,
  delete_employee_service,
  employee_login_service,
  employee_change_password_service
} from "../services/userService.js";


// ======================================================
// LIST
// ======================================================

export const list_employee_controller = async (req, res) => {
  try {

    const query = {
      ...req.query,
    };

    const response = await list_employee_service(query);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }
};


// ======================================================
// ADD
// ======================================================

export const add_employee_controller = async (req, res) => {

  try {

    const body = {
      ...req.user,
      ...req.body,

      datatype: "email",
    };

    const employeeDetails =
      await employee_details_service(body);

    if (employeeDetails.status) {

      return res.status(status_code.CONFLICT).json({
        status: 0,
        status_code: status_code.CONFLICT,
        message: response_message.alreadyExists,
      });

    }

    const response =
      await add_employee_service(body);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }
};


// ======================================================
// UPDATE
// ======================================================

export const update_employee_controller = async (req, res) => {

  try {

    const body = {
      ...req.user,
      ...req.body,

      datatype: "employeeId",
    };

    const employeeDetails =
      await employee_details_service(body);

    if (!employeeDetails.status) {

      return res.status(status_code.NOT_FOUND).json({
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.notExistUser,
      });

    }

    const response =
      await update_employee_service(body);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }
};


// ======================================================
// DELETE
// ======================================================

export const delete_employee_controller = async (req, res) => {

  try {

    const body = {
      ...req.user,
      ...req.body,

      // IMPORTANT
      datatype: "employeeId",
    };

    const employeeDetails =
      await employee_details_service(body);

    if (!employeeDetails.status) {

      return res.status(status_code.NOT_FOUND).json({
        status: 0,
        status_code: status_code.NOT_FOUND,
        message: response_message.notExistUser,
      });

    }

    const response =
      await delete_employee_service(body);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }
};


// ======================================================
// LOGIN
// ======================================================

export const login_employee_controller = async (req, res) => {

  try {

    const body = {
      ...req.body,
      datatype: "email",
    };

    const userExist =
      await employee_details_service(body);

    if (!userExist.status) {

      return res.status(status_code.CONFLICT).json({
        status: 0,
        status_code: status_code.CONFLICT,
        message: response_message.notExistUser,
      });

    }

    // Don't allow inactive user to login
    if (!userExist.data.status) {

      return res.status(status_code.FORBIDDEN).json({
        status: 0,
        status_code: status_code.FORBIDDEN,
        message: response_message.inactiveUser,
      });

    }

    const data = {
      ...req.body,
      ...userExist,
    };

    // console.log('data:',data);
    

    const response =
      await employee_login_service(data);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }
};

// controllers/employee.controller.js
export const change_password_controller = async (req, res) => {

  try {

    // console.log('req.body:',req.body);

    // Logged in employee comes from the authentication middleware
    // const body = {
    //   ...req.body,
    //   datatype:""
    // };

    // const userExist =
    //   await employee_details_service(body);

    // if (!userExist.status) {

    //   return res.status(status_code.CONFLICT).json({
    //     status: 0,
    //     status_code: status_code.CONFLICT,
    //     message: response_message.notExistUser,
    //   });

    // }

    // Don't allow inactive user to change password
    // if (!userExist.data.status) {

    //   return res.status(status_code.FORBIDDEN).json({
    //     status: 0,
    //     status_code: status_code.FORBIDDEN,
    //     message: response_message.inactiveUser,
    //   });

    // }

    const data = {
      ...req.body,
      ...req.user
    };

    // console.log('data:',data);

    const response =
      await employee_change_password_service(data);

    return res
      .status(response.status_code)
      .json(response);

  } catch (error) {

    return res.status(status_code.BAD_REQUEST).json({
      status: 0,
      status_code: status_code.BAD_REQUEST,
      message: error.message,
    });

  }

};