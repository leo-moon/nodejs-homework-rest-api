const { HttpError } = require("../helpers");

const contacts = require("../models/contacts");

const { cntrWrapper } = require("../utils");


const getAllContacts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.getContact(contactId);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} id not found`);
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  if (!result) throw HttpError(404, `Contact with ${id} id not found`);
  res.json(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);
  if (!result) throw HttpError(404, `Contact with ${id} id not found`);
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: cntrWrapper(getAllContacts),
  getContact: cntrWrapper(getContact),
  addContact: cntrWrapper(addContact),
  removeContact: cntrWrapper(removeContact),
  updateContact: cntrWrapper(updateContact),
};
