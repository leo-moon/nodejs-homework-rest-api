const express = require("express");

const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");

const cntr = require('../../controllers/auth-controllers')

const {authenticate} = require('../../middlewares')

const router = express.Router();

// auth, signup
router.post("/register", validateBody(schemas.registreSchema), cntr.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), cntr.login);

router.get("/current", authenticate, cntr.getCurrent);

router.post("/logout", authenticate, cntr.logout);

module.exports = router;
