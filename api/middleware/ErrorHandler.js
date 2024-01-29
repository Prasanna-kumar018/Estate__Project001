const codes = require("../constants");
const errorHandler = (err, req, res, next) =>
{
  console.log("ERROR: "+ err.message+ "  "+ res.statusCode);
  if (err.message !== undefined && res.statusCode === 200) {
    res.status(500);
    res.json({
      title:"Internal Server Error",
      message: err.message,
      stackTrace: err.stack,
    });
}
  const statuscode = res.statusCode ;
  switch (statuscode) {
    case codes.BAD_REQUEST:
      res.json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case codes.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case codes.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case codes.UN_AUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case codes.INTERNAL_SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log("All are good no errors!");
      break;
  }
  next();
};
module.exports = errorHandler;
