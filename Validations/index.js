const joi = require('joi');

const Joi = require("joi");

const validateRegister = (data) => {
 const createSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  nicknames: Joi.string().required(),
  is_admin: Joi.boolean().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(11).required().label("Phone number").messages({
    "string.empty": `"Phone Number" cannot be an empty`,
    "string.min": `"Phone Number should have length of 11 digits`,
    "any.required": `"phone Number" is a required field`,
  }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
    .required()
    .label("Password")
    .messages({
      "string.empty": `"Password" cannot be an empty`,
      "string.min": `"Password" should have a minimum length of {#limit}`,
      "any.required": `"Password" is a required field`,
      "object.regex": `Must have at least 8 characters`,
      "string.pattern.base": `Password must contain at least a number, letter and special characters`,
    }),
});
return createSchema.validate(data)
}

const validateLoger = (data)=>{
const createLogerSchema = joi.object({
    email: Joi.string().email().required(),
  password: Joi.string().min(11).required().label("Phone number").messages({
    "string.empty": `"Phone Number" cannot be an empty`,
    "string.min": `"Phone Number should have length of 11 digits`,
    "any.required": `"phone Number" is a required field`,
  }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
    .required()
    .label("Password")
    .messages({
      "string.empty": `"Password" cannot be an empty`,
      "string.min": `"Password" should have a minimum length of {#limit}`,
      "any.required": `"Password" is a required field`,
      "object.regex": `Must have at least 8 characters`,
      "string.pattern.base": `Password must contain at least a number, letter and special characters`,
    }),
});
return createLogerSchema.validate(data);
}

const validateRole = (data) => {
    const roleSchema = joi.object({
        roleName: joi.string().required(),
        description: joi.string().required()
    })
    return roleSchema.validate(data);
}
module.exports = {validateLoger,  validateRegister, validateRole}