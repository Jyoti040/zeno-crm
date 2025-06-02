const CustomAPIError = require('../error/CustomError')

function isAuthenticated(req, res, next) {
 try {
    console.log("in is auth middleware ",req.isAuthenticated)
     if (req.isAuthenticated && req.isAuthenticated()) {
       return next();
     }
     throw new CustomAPIError('Unauthorized. Please login first.', 401);
 } catch (error) {
    next(error)
 }
}

module.exports = {
  isAuthenticated
};
