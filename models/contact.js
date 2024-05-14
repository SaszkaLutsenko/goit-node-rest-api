import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";
import Joi from "joi";

const contactsShema = new mongoose.Schema(
    {
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
        owner: {
          type: Schema.Types.ObjectId,
          ref: 'user',
        }
      }, 
      {
        versionKey: false,
        timestamps: true,
      }
);


const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
  favorite: Joi.boolean(),  
})

const updateContactSchema = Joi.object({
 
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string()
  .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
  favorite: Joi.boolean(),
}).min(1).message("Body must have at least one field")

const updateFavoriteContactShema = Joi.object({
  favorite: Joi.boolean().required(),
})

contactsShema.post("save", handleMongooseError)


const Contact = mongoose.model("Contact", contactsShema);

export default {
  Contact,
  createContactSchema,
  updateContactSchema,
  updateFavoriteContactShema,
}
