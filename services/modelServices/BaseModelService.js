import { StatusCodes } from 'http-status-codes';

import HttpError from '../../helpers/HttpError.js';

export default class BaseModelService {
  // Model is required to be provided in the class extending it
  constructor(model) {
    this.Model = model;
  }

  defaultSelectFields = '';

  asyncFail(promise) {
    return promise.then((response) => {
      if (!response) throw new HttpError(StatusCodes.NOT_FOUND);

      return response;
    });
  }

  find(filter = {}, fields = '') {
    return this.Model.findOne(filter, fields);
  }

  findOrFail(...args) {
    return this.asyncFail(this.find(...args));
  }

  findById(id, fields = this.defaultSelectFields) {
    return this.Model.findById(id, fields);
  }

  findByIdOrFail(id) {
    return this.asyncFail(this.findById(id));
  }

  findOne(filter, fields = this.defaultSelectFields) {
    return this.Model.findOne(filter, fields);
  }

  create(data) {
    return this.Model.create(data);
  }

  update(id, data) {
    return this.Model.findByIdAndUpdate(id, data);
  }

  updateOne(filter, data) {
    return this.Model.findOneAndUpdate(filter, data);
  }

  updateOrFail(...args) {
    return this.asyncFail(this.update(...args));
  }

  getAll(filter, query = {}) {
    return this.Model.find(filter, this.defaultSelectFields, query);
  }

  deleteById(id) {
    return this.Model.findByIdAndDelete(id);
  }

  deleteByIdOrFail(id) {
    return this.asyncFail(this.deleteById(id));
  }

  deleteOne(filter) {
    return this.Model.findOneAndDelete(filter);
  }

  deleteAll(filter) {
    return this.Model.deleteMany(filter);
  }

  checkIfExists(filter) {
    return this.Model.exists(filter);
  }

  getCount(filter) {
    return this.Model.countDocuments(filter);
  }
}
