import Joi from 'joi';

const validator = {
  validateUser(user: any) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required()
    });
    return schema.validate(user);
  },

  validateLogin(data: any) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
    return schema.validate(data);
  },

  // other validation methods remain unchanged
};

export default validator;
