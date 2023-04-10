const Joi = require("joi");
// const { HttpError } = require("../../helpers");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required `,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" is required `,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is required `,
  }),
  // favorite: Joi.string(),
});

module.exports = { addSchema };
