const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  console.log(data)
  return JSON.parse(data);
};

const getContact = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find(
    contact =>
      contact.id === id 
  );
  return result || null;
};

const removeContact = async id => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) return null;
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) =>     
      (contact.name === name) &
      (contact.phone === phone) &
      (contact.email === email)   
  );

  if (index !== -1)
    return contacts[index];
  const addingContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(addingContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return addingContact;
};

const updateContact = async ( id, body ) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  
  if (index === -1)
    return null;
  contacts[index] = {id, ...body}
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};


module.exports = {
  listContacts,
  getContact,
  removeContact,
  addContact,
  updateContact,
}
