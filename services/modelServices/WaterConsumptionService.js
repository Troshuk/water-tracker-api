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

  updateWaterForUser(owner, filter, data) {
    return this.Model.updateMany({ owner, ...filter }, data);
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

  getFirstWaterForUserForDateRange(owner, fromDate, toDate) {
    return this.Model.findOne({
      owner,
      consumed_at: { $gte: fromDate, $lte: toDate },
    });
  }

  getStatisticsByDateRange(owner, fromDate, toDate, timezone) {
    return WaterConsumption.aggregate([
      {
        $match: {
          consumed_at: {
            $gte: fromDate,
            $lte: toDate,
          },
          owner,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$consumed_at',
              timezone,
            },
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          dailyWaterGoal: { $first: '$dailyWaterGoal' },
        },
      },
      {
        $addFields: {
          consumptionPercentage: {
            $let: {
              vars: {
                totalValue: '$totalValue',
                dailyWaterGoal: '$dailyWaterGoal',
              },
              in: {
                $trunc: {
                  $cond: [
                    { $gte: ['$totalValue', '$dailyWaterGoal'] },
                    100,
                    {
                      $multiply: [
                        { $divide: ['$totalValue', '$dailyWaterGoal'] },
                        100,
                      ],
                    },
                  ],
                },
              },
            },
          },
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
  }
}

export default new WaterService(WaterConsumption);
