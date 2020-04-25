const jwt = require("jsonwebtoken");
const { secret } = require("./config");

const checkAuthorization = () => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const [bearer, token] = authorization.split("");

    jwt.verify(token, secret, (err, result) => {
      if (err) {
        res.status(401).json({
          error: 401,
          message: "Unauthorized request",
        });
      }
    });

    return next();
  }
  res.status(401).json({
    error: 401,
    message: "Unauthorized request",
  });
};

module.exports = { checkAuthorization };
