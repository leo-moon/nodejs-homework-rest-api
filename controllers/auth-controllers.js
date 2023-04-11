const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { cntrWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(409, "Email already exists");
  }
  const hashPass = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashPass });
  console.log("result", result);
  res.status(201).json({
    name: result.name,
    email: result.email,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or pass invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or pass invalid");
  }

  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  res.json({ token });
};

module.exports = {
  register: cntrWrapper(register),
  login: cntrWrapper(login),
};
