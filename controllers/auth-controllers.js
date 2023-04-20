const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { cntrWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPass = await bcrypt.hash(password, 10);
  const result = await User.create({ ...req.body, password: hashPass });
  console.log("result", result);
  res.status(201).json({
    user: {
      email: result.email,
      password: password,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(HttpError(401, "Email or password is wrong"));
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    next(HttpError(401, "Email or password is wrong"));
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token: token,
    user: {
      email: email,
      password: password,
    },
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;

  res.json({
    email: email,
    subscription: subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "U R logout success",
  });
};

const subscriptionChange = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.query;
  console.log(subscription);
  await User.findByIdAndUpdate(_id, {
    subscription: subscription,
  });

  res.json({
    email: email,
    subscription: subscription,
  });
};

module.exports = {
  register: cntrWrapper(register),
  login: cntrWrapper(login),
  getCurrent: cntrWrapper(getCurrent),
  logout: cntrWrapper(logout),
  subscriptionChange: cntrWrapper(subscriptionChange),
};
