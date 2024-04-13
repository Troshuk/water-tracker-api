import WaterConsumption from '../../models/WaterConsumption.js';
import BaseModelService from './BaseModelService.js';

class WaterService extends BaseModelService {
  addWaterForUser(data) {
    return this.Model.create(data)
  }
  getWaterForUserById(data) {
    return this.Model.findOne(data)
  }
}

export default new WaterService(WaterConsumption);
