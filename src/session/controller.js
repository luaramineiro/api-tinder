const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("./config");
const User = require("../user/model");

const comparePassword = async (string, password) => {
  return bcrypt.compare(string, password);
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) {
    res.json({
      error: 200,
      message: "Email or password is empty",
    });
  }

  const users = User.getByEmail(email);

  if (users.length) {
    const user = users[0];
    const doesPasswordMatch = await comparePassword(password, user.password);

    if (doesPasswordMatch) {
      const token = jwt.sign({ email }, secret, { expiresIn });

      return res.json({
        name: user.name,
        username: user.username,
        email: user.email,
        token,
      });
    }

    return res.json({
      error: 403,
      message: "Forbidden access",
    });
  }

  return res.json({
    error: 404,
    message: "User Not Found",
  });
};

const googleSignIn = async () => {};

const facebookSignIn = async () => {};

module.exports = { signIn, googleSignIn, facebookSignIn };
