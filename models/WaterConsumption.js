import { model } from 'mongoose';

import BaseSchema from './BaseSchema.js';
import User from './User.js';
import { waterConsumptionOptions } from '../constants/userConstants.js';

export default model(
  'water_consumption',
  new BaseSchema(
    {
      value: {
        type: Number,
        required: [true, 'Value is required'],
        min: waterConsumptionOptions.MIN,
        max: waterConsumptionOptions.MAX,
      },
      consumed_at: {
        type: Date,
        required: [true, 'Consumption time is required'],
      },
      owner: {
        type: BaseSchema.Types.ObjectId,
        ref: User.modelName,
        required: [true, "Owner's ID is required"],
      },
    },
    {
      timestamps: true,
    }
  )
);
