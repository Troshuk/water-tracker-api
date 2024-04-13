import { model } from 'mongoose';

import BaseSchema from './BaseSchema.js';
import User from './User.js';

export default model(
    'water_consumption',
    new BaseSchema(
        {
            value: {
                type: Number,
                required: [true, 'Value is required'],
                max: 5000,
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
            timestamps: true
        }
    )
);
