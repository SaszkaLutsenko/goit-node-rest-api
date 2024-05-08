
import HttpError from "../helpers/HttpError.js"
import { Contact, createContactSchema, updateContactSchema, updateFavoriteContactShema } from "../models/contact.js";


export const getAllContacts = async (req, res, next ) => {
    try {
        const contact = await Contact.find();
        res.status(201).send(contact);

    } catch(error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const {id} = req.params;
   
        const contact = await Contact.findById(id)
        if(contact === null){
            throw HttpError(404, "Not found");
        }
        res.status(200).send(contact);

    } catch(error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const contact = await Contact.findByIdAndDelete(id);
    if(contact === null){
        throw HttpError(404, "Not found");
    }
    res.status(200).send(contact);
    } catch(error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,   
        phone: req.body.phone,
    }
    try {
        const {error} = createContactSchema.validate(contact);
        if(error){
            throw HttpError(400, error.message);
        } 
        const result = await Contact.create(contact);
        res.status(201).send(result);
    } catch(error){
        next(error);
    }
};

export const updateContact = async (req, res, next)  => {
    const {id} = req.params;
    const contact = {
        name: req.body.name,
        email: req.body.email,   
        phone: req.body.phone,
    }
    try {
        const {error} = updateContactSchema.validate(contact);
        if(error){
            throw HttpError(400, error.message);
        }; 
        
        const result = await Contact.findByIdAndUpdate(id, contact, {new: true});
        if(result === null){
            throw HttpError(400, error.message);
        };
        res.status(200).send(result);
    } catch(error){
        next(error);
    }
};

