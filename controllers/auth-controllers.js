const bcrypt = require('bcryptjs')

const { cntrWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const emailUnique = await User.findOne({ email });
  if (emailUnique) {
    throw HttpError(409, "Email already exists");
    }
    const hashPass = await bcrypt.hash(password, 10)
  const result = await User.create({...req.body, password: hashPass});
  console.log("result", result);
  res.status(201).json({
    name: result.name,
    email: result.email,
  });
};

module.exports = {
  register: cntrWrapper(register),
};
