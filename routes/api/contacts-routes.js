const express = require("express");
// const Joi = require("joi")
// const contacts = require('../../models/contacts')
const cntr = require("../../controllers/contacts-controllers");
const  contactSchema  = require("../../schemas/contacts-schema");
const { validateBody } = require("../../utils");

const router = express.Router();

router.get("/", cntr.getAllContacts);

router.get("/:contactId", cntr.getContact);

router.post("/", validateBody(contactSchema.addSchema), cntr.addContact);

router.put("/:id", validateBody(contactSchema.addSchema), cntr.updateContact);

router.delete("/:id", cntr.removeContact);

module.exports = router;
