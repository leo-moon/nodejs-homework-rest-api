const express = require("express");

const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");

const cntr = require('../../controllers/auth-controllers')


const router = express.Router();

// auth, signup
router.post("/register", validateBody(schemas.registreSchema), cntr.register);

module.exports = router;
