// const { Schema, model } = require("mongoose");
const { Schema, model } = require("mongoose");

const Joi = require("joi");

const handleMongooseError = require("../utils/handleMongooseError");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const emailRegexp = "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/";
const passMinLength = 4;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      minlength: passMinLength,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registreSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required `,
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    "any.required": `"email" is required `,
  }),
  password: Joi.string().min(passMinLength).required().messages({
    "any.required": `"password" is required `,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).messages({
    "any.required": `"email" is required `,
  }),
  password: Joi.string().min(passMinLength).required().messages({
    "any.required": `"password" is required `,
  }),
});

const schemas = {
  registreSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
