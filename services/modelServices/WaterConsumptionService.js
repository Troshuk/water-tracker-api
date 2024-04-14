import WaterConsumption from '../../models/WaterConsumption.js';
import BaseModelService from './BaseModelService.js';

class WaterService extends BaseModelService {
  addWaterForUser(owner, data) {
    return this.Model.create({ owner, ...data });
  }

  getWaterForUserById(owner, _id) {
    return this.Model.findOne({ owner, _id });
  }

  deleteUsersWaterById(owner, _id) {
    return this.Model.findOneAndDelete({ owner, _id });
  }

  updateUsersConsumedWaterById(owner, _id, data) {
    return this.Model.findOneAndUpdate({ owner, _id }, data, {
      new: true,
      runValidators: true,
    });
  }

  getAllListConsumedWater(owner, query = {}) {
    return this.Model.find({ owner }, query);
  }
}

export default new WaterService(WaterConsumption);
