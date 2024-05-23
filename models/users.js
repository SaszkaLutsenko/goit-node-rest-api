import mongoose from "mongoose";
import Joi from "joi";

const userShema = new mongoose.Schema(
    {
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
        avatarURL: {
          type: String,
          required: true,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          default: [true, 'Verify token is required'],
        }
      }
);

const User = mongoose.model("User", userShema);


const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export default {
  User,
  userSchema,
  emailSchema,
}