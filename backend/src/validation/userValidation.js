import joi from "joi";

export const add_employee_schema = joi.object({
  name: joi.string().required(),

  department: joi.string().required(),

  // age: joi
  //   .number()
  //   .min(18)
  //   .message({
  //     "number.min": "min age is 18",
  //   })
  //   .required(),

  email: joi.string().email().required(),

  phone: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
      "any.required": "Phone number is required",
    }),

  password: joi
    .string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .messages({
      "string.min": "Password must be 8 character long",
      "string.max": "Password must be 20 character long",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
    })
    .required(),

  location: joi.string().required(),

  status: joi
    .number()
    .valid(0, 1)
    .strict()
    .messages({
      "any.only": "number must be 1 or 2",
      "any.required": "status is required",
    })
    .required(),

  type: joi
    .number()
    .valid(1, 2, 3)
    .strict()
    .messages({
      "any.only": "type must be 1 ,2 or 3",
      "any.required": "type is required",
    })
    .required(),

  joining_date: joi
    .string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .messages({
        "string.pattern.base": "joining_date date must be YYYY-MM-DD",
        "any.required": "joining_date date is required",
    })
    .required(),

  salary: joi.number().required().messages({
    "any.required": "salary is required",
  }),
});

export const update_employee_schema = joi.object({

  employeeId: joi.string().required(),

  name: joi.string().required(),

  department: joi.string().required(),

  email: joi.string().email().required(),

  phone: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
      "any.required": "Phone number is required",
    }),

  // password: joi
  //   .string()
  //   .min(8)
  //   .max(20)
  //   .pattern(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   )
  //   .messages({
  //     "string.min": "Password must be 8 character long",
  //     "string.max": "Password must be 20 character long",
  //     "string.pattern.base":
  //       "Password must contain uppercase, lowercase, number and special character",
  //   })
  //   .required(),

  location: joi.string().required(),
  status: joi
    .number()
    .valid(0, 1)
    .strict()
    .messages({
      "any.only": "number must be 0 or 1",
      "any.required": "statue is required",
    })
    .required(),

  type: joi
    .number()
    .valid(1, 2, 3)
    .strict()
    .messages({
      "any.only": "type must be 1 ,2 or 3",
      "any.required": "type is required",
    })
    .required(),

  joining_date: joi
    .string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .messages({
        "string.pattern.base": "joining_date date must be YYYY-MM-DD",
        "any.required": "joining_date date is required",
    })
    .required(),

  salary: joi.number().required().messages({
    "any.required": "salary is required",
  }),

});

export const delete_employee_schema = joi.object({
  employeeId: joi.string().required().messages({
    "any.required": "employeeId is required",
  }),
  
});

export const list_employee_schema = joi.object({
  page: joi.string().required(),
  limit: joi.string().required(),
});

export const employee_login_schema=joi.object({
  email:joi.string().email().required(),
  password:joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required()
})

export const change_password_schema = joi.object({
  current_password: joi.string().required(),

  new_password: joi.string().required(),

  confirm_password: joi.any().valid(joi.ref('new_password')).required()
});
