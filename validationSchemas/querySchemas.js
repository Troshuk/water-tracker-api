import Joi from 'joi';
import { orderTypes } from '../constants/queryConstants.js';

const pagination = {
  offset: Joi.number().min(0),
  limit: Joi.number().min(1),
};
const sort = (fields = []) => ({
  sortBy: Joi.string().valid(...fields),
  order: Joi.string().valid(...Object.values(orderTypes)),
});
const search = {
  search: Joi.string().max(15),
};

export const querySchema = (sortFields = []) =>
  Joi.object({ ...pagination, ...sort(sortFields), ...search });
export const paginationSchema = Joi.object(pagination);
export const sortSchema = (fields = []) => Joi.object(sort(fields));
export const searchSchema = Joi.object(search);
