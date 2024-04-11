import { model, Schema } from 'mongoose';
import { handlePostSaveError, setPreUpdateSettings } from './hooks.js';

const entrySchema = new Schema(
  {
    dailyNorma: {
      type: Number,
      default: 2000,
      max: 15000,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false }
);

entrySchema.post('save', handlePostSaveError);

entrySchema.pre('findOneAndUpdate', setPreUpdateSettings);
entrySchema.post('findOneAndUpdate', handlePostSaveError);

const Entry = model('entry', entrySchema);

export default Entry;
