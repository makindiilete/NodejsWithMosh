//General try catch function middleware for all routes: - We moved the try/catch block to this central point so we dont need to repeat it in every handlers and here we pass the "req, res, next" that express needs to run it as an arrow function inside the asyncMiddleware function
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};
