const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("./config");
const User = require("../user/model");

const comparePassword = async (string, password) => {
  return bcrypt.compare(string, password);
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      error: 200,
      message: "Email or password is empty",
    });
  }

  const users = await User.getMyself(email);

  if (users.length) {
    const user = users[0];
    const doesPasswordMatch = await comparePassword(password, user.password_hash);
    const id = user.id;
    if (doesPasswordMatch) {
      const token = jwt.sign({ id }, secret, { expiresIn });

      return res.json({
        id: id,
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

const googleSignIn = async () => { };

const facebookSignIn = async () => { };

module.exports = { signIn, googleSignIn, facebookSignIn };
