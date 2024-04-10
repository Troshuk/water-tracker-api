export default (callback) => (req, res, next) => {
  callback(req, res, next)?.catch(next);
};
