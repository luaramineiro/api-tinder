const jwt = require("jsonwebtoken");
const config = require("./config");

const checkAuthorization = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const [bearer, token] = authorization.split(" ");

    jwt.verify(token, config.SECRET, (err, result) => {
      if (err) {
        res.status(401).json({
          error: 401,
          message: "Unauthorized request",
        });
      }

      req.body.id = result.id;
    });

    return next();
  }

  res.status(401).json({
    error: 401,
    message: "Unauthorized request",
  });
};

module.exports = { checkAuthorization };
