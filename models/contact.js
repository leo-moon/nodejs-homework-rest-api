const { Schema, model } = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../utils/handleMongooseError");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
});

contactSchema.post("save", handleMongooseError);

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
  favorite: Joi.boolean(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

const schemas = { addSchema, favoriteSchema };

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
