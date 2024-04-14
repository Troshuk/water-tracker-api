import WaterConsumption from '../../models/WaterConsumption.js';
import BaseModelService from './BaseModelService.js';

class WaterService extends BaseModelService {
  addWaterForUser(owner, data) {
    return this.Model.create({ owner, ...data });
  }

  getWaterForUserById(owner, _id) {
    return this.Model.findOne({ owner, _id });
  }

  getWaterForUserByDateRange(owner, fromDate, toDate) {
    return this.Model.find({
      owner,
      consumed_at: { $gte: fromDate, $lte: toDate },
    });
  }

  getWaterForUserForToday(owner) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.getWaterForUserByDateRange(owner, startOfDay, endOfDay);
  }
}

export default new WaterService(WaterConsumption);
