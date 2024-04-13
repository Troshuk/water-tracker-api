import WaterConsumption from '../../models/WaterConsumption.js';
import BaseModelService from './BaseModelService.js';

class WaterService extends BaseModelService {
  addWater(data) { return this.Model.create(data) }
  getWaterById(data) { return this.Model.findById(data) }
}

export default new WaterService(WaterConsumption);
