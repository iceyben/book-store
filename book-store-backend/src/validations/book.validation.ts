import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().trim().min(2).required(),
  author: Joi.string().trim().min(2).required(),
  isbn: Joi.string().trim().required(),
  imageUrl: Joi.string().uri().optional(),
  quantity: Joi.number().integer().min(1).required(),
  categoryId: Joi.string().length(24).hex().required(),
});
