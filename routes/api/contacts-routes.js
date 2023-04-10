const express = require("express");
const cntr = require("../../controllers/contacts-controllers");
const { schemas } = require("../../models/contact");
const { validateBody } = require("../../utils");

const router = express.Router();

router.get("/", cntr.getAllContacts);

router.get("/:contactId", cntr.getContact);

router.post("/", validateBody(schemas.addSchema), cntr.addContact);

router.put("/:id", validateBody(schemas.addSchema), cntr.updateContact);

router.patch(
  "/:id/favorite",
  validateBody(schemas.favoriteSchema),
  cntr.updateStatusContact
);

router.delete("/:id", cntr.deleteContact);

module.exports = router;
