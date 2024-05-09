import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteContact
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";


const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContact), createContact) ;

contactsRouter.put("/:id", validateBody(updateContact), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateFavoriteContact), updateFavoriteContact);

export default contactsRouter;