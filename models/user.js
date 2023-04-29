const { Schema, model } = require("mongoose");

const Joi = require("joi");

const handleMongooseError = require("../utils/handleMongooseError");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const passMinLength = 4;

const userSchema = new Schema(
  {
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
    token: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      require: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).messages({
    "any.required": `"email" is required `,
  }),
  password: Joi.string().min(passMinLength).required().messages({
    "any.required": `"password" is required `,
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).messages({
    "any.required": `"email" is required `,
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
  registerSchema,
  loginSchema,
  emailSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
