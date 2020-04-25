const bcrypt = require("bcryptjs");

const encryptPassword = async (req, res, next) => {
  const password = req.body.password_hash;

  if (!password) {
    res.json({
      error: 400,
      message: "Bad Format. Password is Required.",
    });
  }

  const password_hash = await bcrypt.hash(password, 10);

  req.body.password_hash = password_hash;

  return next();
};

module.exports = { encryptPassword };
