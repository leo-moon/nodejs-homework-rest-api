const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { cntrWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const hashPass = await bcrypt.hash(password, 10);
  const result = await User.create({
    ...req.body,
    password: hashPass,
    avatarURL: avatarURL,
    verificationToken: verificationToken,
  });
  console.log("result1", result);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target='_blank' href="${BASE_URL}/api/auth/verify/${verificationToken}" >Click verify your email </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: result.email,
      password: password,
      avatarURL: avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  console.log('verificationToken', verificationToken, req.params)
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate (user._id, { verify: true, verificationToken: '' });
  res.json({
    message: "Verification successful",
  });
};

const reverify = async (req, res) => {
  const { email } = req.body;
  console.log("email", email, req.body);
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
const verifyEmail = {
  to: email,
  subject: "Verify email",
  html: `<a target='_blank' href="${BASE_URL}/api/auth/verify/${user.verificationToken}" >Click verify your email </a>`,
};

await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(HttpError(401, "Email or password is wrong"));
  }
  if (!user.verify) {
    next(HttpError(401, "Email not verify"));
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

const avatarChange = async (req, res, cb) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  Jimp.read(tempUpload, (err, ava) => {
    if (err) throw err;
    ava
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      // .greyscale() // set greyscale
      .write(tempUpload); // save
  });

  const avatarNewFileName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, avatarNewFileName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarNewFileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: cntrWrapper(register),
  verify: cntrWrapper(verify),
  reverify: cntrWrapper(reverify),
  login: cntrWrapper(login),
  getCurrent: cntrWrapper(getCurrent),
  logout: cntrWrapper(logout),
  subscriptionChange: cntrWrapper(subscriptionChange),
  avatarChange: cntrWrapper(avatarChange),
};
