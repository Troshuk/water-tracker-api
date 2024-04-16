import WaterConsumption from '../../models/WaterConsumption.js';
import BaseModelService from './BaseModelService.js';

class WaterService extends BaseModelService {
  addWaterForUser(owner, data) {
    return this.Model.create({ owner, ...data });
  }

  getWaterForUserById(owner, _id) {
    return this.Model.findOne({ owner, _id });
  }

  deleteWaterForUserById(owner, _id) {
    return this.Model.findOneAndDelete({ owner, _id });
  }

  updateWaterForUserById(owner, _id, data) {
    return this.Model.findOneAndUpdate({ owner, _id }, data);
  }

  getAllWater(owner, query = {}) {
    return this.Model.find({ owner }, query);
  }

  getWaterForUserByDateRange(owner, fromDate, toDate) {
    return this.Model.find({
      owner,
      consumed_at: { $gte: fromDate, $lte: toDate },
    });
  }

  getWaterForUserForToday(owner) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    return this.getWaterForUserByDateRange(owner, startOfDay, endOfDay);
  }

  async getStatisticsByDateRange(owner, dailyWaterGoal, startDate, endDate) {
    const aggregateResult = await WaterConsumption.aggregate([
      {
        $match: {
          consumed_at: {
            $gte: startDate,
            $lte: endDate,
          },
          owner,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$consumed_at' } },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
      {
        $addFields: {
          consumptionPercentage: {
            $trunc: {
              $multiply: [{ $divide: ['$totalValue', dailyWaterGoal] }, 100],
            },
          },
          dailyWaterGoal,
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
          totalValue: 1,
          consumptionPercentage: 1,
          dailyWaterGoal: 1,
        },
      },
    ]);

    return aggregateResult;
  }
}

export default new WaterService(WaterConsumption);
