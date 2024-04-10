export const handlePostSaveError = (error, _, next) => {
  // eslint-disable-next-line no-param-reassign
  error.status = 400;

  next();
};

export function setPreUpdateSettings(next) {
  // Make sure that after update we return back an updated record instead of original
  this.options.new = true;
  // Enable data validation for the update method
  this.options.runValidators = true;

  next();
}
