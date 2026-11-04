import joi from "joi";


export const list_leave_schema=joi.object({
    page:joi.number().required(),
    limit:joi.number().required()
});

export const add_leave_schema = joi.object({
  leave_type: joi.number().valid(1, 2, 3, 4).strict().required(),
  type: joi.number().valid(1, 2).strict().required(),
  from_date: joi.string().required(),
  to_date: joi.string().required(),
  reason: joi.string().required(),
});

export const update_leave_schema = joi.object({
  id: joi.string().required(),
  leave_type: joi.number().valid(1, 2, 3, 4).strict().required(),
  type: joi.number().valid(1, 2).strict().required(),
  from: joi.string().required(),
  to: joi.string().required(),
  reason: joi.string().required(),
});

export const status_leaves_schema=joi.object({
  id:joi.string().required(),
  status:joi.number().valid(2,3).strict().required()
});

export const delete_leave_schema=joi.object({
  id:joi.string().required()
});
