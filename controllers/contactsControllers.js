import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";



export const getAllContacts = async (req, res, next ) => {
    try {
        const contact = await contactsService.listContacts();
        res.status(201).json(contact);

    } catch(error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const {id} = req.params;
   
        const contact = await contactsService.getContactById(id)
        if(!contact){
            throw HttpError(404, "Not found");
        }
        res.status(200).json(contact);

    } catch(error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const contact = await contactsService.removeContact(id);
    if(!contact){
        throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
    } catch(error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body);
        if(error){
            throw HttpError(400, error.message);
        } 
        const contact = await contactsService.addContact(req.body);
        res.status(201).json(contact);
    } catch(error){
        next(error);
    }
};

export const updateContact = async (req, res, next)  => {
    try {
        const {error} = updateContactSchema.validate(req.body);
        if(error){
            throw HttpError(400, error.message);
        }; 
        const {id} = req.params;
        const contact = await contactsService.updateContact(id, req.body);
        if(!contact){
            throw HttpError(400, error.message);
        };
        res.status(200).json(contact);
    } catch(error){
        next(error);
    }
    


};