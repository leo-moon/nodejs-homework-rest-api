const express = require("express");

const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");

const cntr = require("../../controllers/auth-controllers");

const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

// auth, signup
router.post("/register", validateBody(schemas.registerSchema), cntr.register);

// signin
router.post("/login", validateBody(schemas.loginSchema), cntr.login);

router.get("/current", authenticate, cntr.getCurrent);

router.post("/logout", authenticate, cntr.logout);

router.get("/verify/:verificationToken", cntr.verify);

router.post("/users/verify",  cntr.reverify);
// validateBody(schemas.emailSchema),
router.patch("/users", authenticate, cntr.subscriptionChange);

router.patch(
  "/users/avatar",
  authenticate,
  upload.single("avatarURL"),
  cntr.avatarChange
);

module.exports = router;
