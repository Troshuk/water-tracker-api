import { Schema } from 'mongoose';

import { handlePostSaveError, setPreUpdateSettings } from './hooks.js';

export default class BaseSchema extends Schema {
  constructor(...args) {
    super(...args);

    this.pre('findOneAndUpdate', setPreUpdateSettings)
      .post('findOneAndUpdate', handlePostSaveError)
      .post('save', handlePostSaveError);
  }
}
