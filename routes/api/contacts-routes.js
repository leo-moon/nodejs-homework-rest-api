const express = require("express");
const cntr = require("../../controllers/contacts-controllers");
const { schemas } = require("../../models/contact");
const { validateBody } = require("../../utils");
const { isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, cntr.getAllContacts);

router.get("/:contactId", authenticate, cntr.getContact);

router.post("/", validateBody(schemas.addSchema), cntr.addContact);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  cntr.updateContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  validateBody(schemas.favoriteSchema),
  cntr.updateStatusContact
);

router.delete("/:id", authenticate, cntr.deleteContact);

module.exports = router;
