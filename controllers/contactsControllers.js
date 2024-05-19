
import HttpError from "../helpers/HttpError.js"
import { createContactSchema, updateContactSchema, updateFavoriteContactShema } from "../models/contact.js";
import { listContacts, getContactById, removeContact, addContact, updContact } from "../services/contactsServices.js"

export const getAllContacts = async (req, res, next ) => {
    try {
        
        const contact = await listContacts({owner: req.user.id});

        if (!contact) throw HttpError(404);

        res.status(201).send(contact);

    } catch(error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {_id: owner } = req.user;
   
        const contact = await getContactById({id, owner});

        if(!contact) throw HttpError(404, "Not found");
        
        res.status(200).send(contact);

    } catch(error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {_id: owner } = req.user;
       
        const contact = await removeContact({id, owner})

    if(!contact) throw HttpError(404, "Not found");

    res.status(200).send(contact);
    } catch(error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    
    try {
        const {error} = createContactSchema.validate(req.body);
        if(error) throw HttpError(400, error.message);
        
        const result = await addContact({...req.body, owner: req.user._id});
        res.status(201).send(result);
    } catch(error){
        next(error);
    }
};

export const updateContact = async (req, res, next)  => {
    
    const {id} = req.params;
    const {_id: owner } = req.user;
    try {
        const {error} = updateContactSchema.validate(req.body);
        if(error) throw HttpError(400, error.message);
        
        
        const result = await updContact(id, owner, req.body, { new: true });
        if(!result) throw HttpError(400, error.message);
      
        
        res.status(200).send(result);
    } catch(error){
        next(error);
    }
};

export const updateFavoritContact = async (req, res, next)  => {
   
    const {id} = req.params;
    const {_id: owner } = req.user;
    try {
        const {error} = updateFavoriteContactShema.validate(req.body);
        if(error){
            throw HttpError(400, error.message);
        }; 
        
        const result = await updContact(id, owner, req.body, { new: true });
        if(!result) throw HttpError(400, error.message);
      
        res.status(201).send(result);
    } catch(error){
        next(error);
    }
};

