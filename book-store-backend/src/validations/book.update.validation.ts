import Joi from "joi";

export const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(2).optional(),
  author: Joi.string().trim().min(2).optional(),
  isbn: Joi.string().trim().optional(),
  imageUrl: Joi.string().uri().optional(),
  quantity: Joi.number().integer().min(1).optional(),
  available: Joi.number().integer().min(0).optional(),
  categoryId: Joi.string().length(24).hex().optional(),
}).min(1); // must send at least one field
