
import HttpError from "../helpers/HttpError.js"
import { Contact, createContactSchema, updateContactSchema, updateFavoriteContactShema } from "../models/contact.js";


export const getAllContacts = async (req, res, next ) => {
    try {
        const contact = await Contact.find({ownerId: req.user.id});

        if (!contact) throw HttpError(404);

        res.status(201).send(contact);

    } catch(error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const contactId = req.params.id;
   
        const contact = await Contact.findById(contactId);

        if(!contact) throw HttpError(404, "Not found");

        if(contact.ownerId.toString() !== req.user.id) throw HttpError(404, "Not found");
        
        res.status(200).send(contact);

    } catch(error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByIdAndDelete(contactId);

    if(!contact) throw HttpError(404, "Not found");
    if(contact.ownerId.toString() !== req.user.id) throw HttpError(404, "Not found");

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
        ownerId: req.user.id,
    }
    try {
        const {error} = createContactSchema.validate(contact);
        if(error){
            throw HttpError(400, error.message);
        } 
        const result = await Contact.create({contact});
        res.status(201).send(result);
    } catch(error){
        next(error);
    }
};

export const updateContact = async (req, res, next)  => {
    const contactId = req.params.id;
    const contact = {
        name: req.body.name,
        email: req.body.email,   
        phone: req.body.phone,
        ownerId: req.user.id,
    }
    try {
        const {error} = updateContactSchema.validate(contact);
        if(error) throw HttpError(400, error.message);
        
        
        const result = await Contact.findByIdAndUpdate(contactId, contact, {new: true});
        if(!result) throw HttpError(400, error.message);
        if(contact.ownerId.toString() !== req.user.id) throw HttpError(404, "Not found");
        
        res.status(200).send(result);
    } catch(error){
        next(error);
    }
};

export const updateFavoritContact = async (req, res, next)  => {
    const contactId = req.params.id;
    const contact = {
        name: req.body.name,
        email: req.body.email,   
        phone: req.body.phone,
        ownerId: req.user.id,
    }
    try {
        const {error} = updateFavoriteContactShema.validate(contact);
        if(error){
            throw HttpError(400, error.message);
        }; 
        
        const result = await Contact.findByIdAndUpdate(contactId, contact, {new: true});
        if(!result) throw HttpError(400, error.message);
        if(contact.ownerId.toString() !== req.user.id) throw HttpError(404, "Not found");
        res.status(201).send(result);
    } catch(error){
        next(error);
    }
};

