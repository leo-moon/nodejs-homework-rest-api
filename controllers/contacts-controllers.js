const { HttpError } = require("../helpers");

const { cntrWrapper } = require("../utils");
const { Contact } = require("../models/contact");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;

  if (favorite !== null) {
    const result = await Contact.find(
      { owner, favorite },
      " -createdAt -updatedAt",
      { skip, limit }
    ).populate("owner", "name email");
    res.json(result);
  } else {
    const result = await Contact.find({ owner }, " -createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "name email");
    console.log(result);
    res.json(result);
  }
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  // const result = await Contact.findOne({ _id: contactId });
  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, `Contact with ${contactId} id not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw HttpError(404, `Contact with ${id} id not found`);
  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw HttpError(404, `Contact with ${id} id not found`);
  res.json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) throw HttpError(404, `Contact with ${id} id not found`);
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: cntrWrapper(getAllContacts),
  getContact: cntrWrapper(getContact),
  addContact: cntrWrapper(addContact),
  deleteContact: cntrWrapper(deleteContact),
  updateContact: cntrWrapper(updateContact),
  updateStatusContact: cntrWrapper(updateStatusContact),
};
