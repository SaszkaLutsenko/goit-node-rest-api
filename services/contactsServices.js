import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

async function writeContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
    const data = await readContacts();
    return data;
}

async function getContactById(contactId) {
    const contacts = await readContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    if (contact === undefined) {
        return null;
    }
    return contact;
}

async function removeContact(id) {
    const contacts = await readContacts();
    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
        return null;
    }

    const removedContact = contacts[index];
    contacts.splice(index, 1);
    await writeContacts(contacts);

    return removedContact;
}

async function addContact(name, email, phone) {
    const contacts = await readContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };

    contacts.push(newContact);
    await writeContacts(contacts);

    return newContact;
}

async function updateContact(contactId, contact) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
  
    if (index === -1) {
      return null;
    }

    const newContact = { ...contact, contactId };
    const newContacts = [
        ...contact.slice(0, index),
        newContact,
        ...contact.slice(index + 1),
    ];
    await writeContacts(newContacts);

    return newContact;
  }

async function createContact(contact) {
    const contacts = await readContacts();
    const newContact = {...contact, id: crypto.randomUUID()}

    contacts.push(newContact);

    await writeContacts(contacts);

    return newContact;
}

export default {
    readContacts,
    writeContacts,
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    createContact,
};