export const transformWaterConsumption = ({ id, value, consumed_at }) => ({
  id,
  value,
  consumed_at,
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
