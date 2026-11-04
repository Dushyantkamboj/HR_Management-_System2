import joi from 'joi';

export const list_attendance_schema=joi.object({
    page:joi.number().required(),
    limit:joi.number().required()
});

export const add_attendance_schema=joi.object({
    date:joi.string().required(),
    attendance_type:joi.number().valid(1,2).strict().required()
});