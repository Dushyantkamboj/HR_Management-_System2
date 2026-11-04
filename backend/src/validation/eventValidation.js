import joi from "joi";

export const list_event_schema = joi.object({

  page: joi.string().required().messages({
    "any.required": "page is required",
  }),

  limit: joi.string().required().messages({
    "any.required": "limit is required",
  }),
});

export const add_event_schema = joi.object({

  title: joi.string().required().messages({
    "any.required": "title is required",
  }),

  category: joi.string().required().messages({
    "any.required": "category is required",
  }),

  status: joi.number().valid(0, 1, 2).strict().required().messages({
    "any.only": "status must be 0 1 or 2",
    "any.required": "status is required",
  }),

  date: joi
    .string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required()
    .messages({
      "string.pattern.base": "date date must be YYYY-MM-DD",
      "any.required": "date is required",
    }),

  starts: joi
    .string()
    // .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM AM/PM format",
    }),

  ends: joi
    .string()
    // .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM AM/PM format",
    }),

  location: joi.string().required().messages({
    "any.required": "location is required",
  }),

  organizer: joi.string().required().messages({
    "any.required": "organizer is required",
  }),

  attendees: joi.number().required().messages({
    "any.required": "attendees is required",
  }),

});

export const update_event_schema = joi.object({
  eventId: joi.string().required().messages({
    "any.required": "eventId is required",
  }),

  title: joi.string().required().messages({
    "any.required": "title is required",
  }),

  category: joi.string().required().messages({
    "any.required": "category is required",
  }),

  status: joi.number().valid(0, 1, 2).strict().required().messages({
    "any.only": "number must be 0 1 or 2",
    "any.required": "statue is required",
  }),

  date: joi
    .string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .required()
    .messages({
      "string.pattern.base": "date date must be YYYY-MM-DD",
      "any.required": "date is required",
    }),

  starts: joi
    .string()
    // .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM AM/PM format",
    }),

  ends: joi
    .string()
    // .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM AM/PM format",
    }),



  location: joi.string().required().messages({
    "any.required": "location is required",
  }),

  organizer: joi.string().required().messages({
    "any.required": "organizer is required",
  }),

  attendees: joi.number().required().messages({
    "any.required": "attendees is required",
  }),
});

export const delete_event_schema = joi.object({
  eventId: joi.string().required().messages({
    "any.required": "eventId is required",
  }),
});
