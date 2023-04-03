const express = require('express')
const Joi = require("joi")

const contacts = require('../../models/contacts')

const router = express.Router()

const { HttpError } = require('../../helpers')


const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required `
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" is required `
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is required `
  }),
})


router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts()
    res.json(result)
  } 
  catch(error) {
    next(error)
  }
  
})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  try {
    const result = await contacts.getContact(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} id not found`)
    }
    res.json(result)
  } 
  catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body); 
    if (error) {
      throw HttpError(400, ',kz   error.message')
    }
    const result = await contacts.addContact(req.body)
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await contacts.removeContact(id)
    if (!result) throw HttpError(404, `Contact with ${id} id not found`)
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body); 
    if (error) {
      throw HttpError(400, error.message)
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body)
    if (!result) throw HttpError(404, `Contact with ${id} id not found`)
    res.json(result)
  }
  catch (error) {
    next(error)
  }
})

module.exports = router
