export const transformWaterConsumption = ({
  id,
  value,
  consumed_at,
  dailyWaterGoal,
}) => ({
  id,
  value,
  consumed_at,
  dailyWaterGoal,
});

export const transformWaterConsumptionStatisticsByDateRange = ({
  count,
  totalValue,
  consumptionPercentage,
  dailyWaterGoal,
  date,
}) => ({
  count,
  totalValue,
  consumptionPercentage,
  dailyWaterGoal,
  date,
});
