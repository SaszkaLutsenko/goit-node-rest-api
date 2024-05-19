import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema, updateFavoriteContactShema } from "../models/contact.js";
import { listContacts, getContactById, removeContact, addContact, updContact } from "../services/contactsServices.js"

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts({ owner: req.user.id });

        if (!contacts.length) throw HttpError(404, "Contacts not found");

        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};


export const getOneContact = async (req, res, next) => {
    const {id} = req.params;
    const {_id:owner} = req.user;
    try {
        const contact = await getContactById({ id, owner});

        if (!contact) throw HttpError(404, "Not found");

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    const {id} = req.params;
    const {_id:owner} = req.user;
    try {
        const contact = await removeContact({ id, owner});

        if (!contact) throw HttpError(404, "Not found");

        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};


export const createContact = async (req, res, next) => {
    const {_id:owner} = req.user;
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) throw HttpError(400, error.message);

        const result = await addContact({...req.body, owner});
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


export const updateContact = async (req, res, next) => {
    const {_id:owner} = req.user;
    const {id} = req.params;
    try {
        const { error } = updateContactSchema.validate(req.body);
        if (error) throw HttpError(400, error.message);

        const result = await updContact(id, owner, req.body, { new: true });
        if (!result) throw HttpError(404, "Not found");

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


export const updateFavoriteContact = async (req, res, next) => {
    const {_id:owner} = req.user;
    const {id} = req.params;
    try {
        const { error } = updateFavoriteContactShema.validate(req.body);
        if (error) throw HttpError(400, error.message);

        const result = await updContact(id, owner, req.body, { new: true });
        if (!result) throw HttpError(404, "Not found");

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};