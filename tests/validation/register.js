var Joi = require('joi');
 
module.exports = {
  body: {
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
  }
};