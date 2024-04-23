import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// contacts.js

// Розкоментуй і запиши значення
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

export default {
    listContacts,
    getContactById,
    addContact,
    removeContact,
};