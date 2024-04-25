import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"



export const getAllContacts = async (req, res) => {
    const contact = await contactsService.listContacts();
    res.status(201).json(contact);
};

export const getOneContact = async (req, res) => {
    const {id} = req.params;
    const contact = await contactsService.getContactById(id)
    if(!contact){
        return res.status(404).json({message: HttpError(404).message});
    }
    res.status(201).json(contact);
};

export const deleteContact = async (req, res) => {const {id} = req.params;
    const contact = await contactsService.removeContact(id);
    if(!contact){
        return res.status(404).json({message: HttpError(404).message});
    }
    res.status(201).json(contact);
};

export const createContact = async (req, res) => {
    const {name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
};

export const updateContact = async (req, res)  => {
    const {id} = req.params;
    const contact = await contactsService.updateContact(id);
    if(!contact){
        return res.status(404).json({message: HttpError(404).message});
    }
    res.status(201).json(contact);
    


};