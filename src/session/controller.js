const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const open = require('open');
const User = require("../user/model");
const { google } = require('googleapis');
const oauth2 = google.oauth2('v2');
const config = require("./config");

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
    const expiresIn = config.EXPIRES_IN;
    const secret = config.SECRET;
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

function getOAuthClientGoogle() {
  return new google.auth.OAuth2(
    config.OAUTH2_CLIENT_ID,
    config.OAUTH2_CLIENT_SECRET,
    config.OAUTH2_CALLBACK[0]
  );
};

const googleSignIn = async (req, res) => {

  try {

    const oAuth2Client = await getOAuthClientGoogle();
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.SCOPES,
    });

    // open the browser to the authorize url to start the workflow
    open(authUrl, { wait: false }).then(cp => cp.unref());

  } catch (error) {
    console.log(error);

    return res.json({
      error: 400,
      message: "Bad Request",
    });
  }
};

const googleOAuthCallback = async (req, res) => {
  const oAuth2Client = await getOAuthClientGoogle();
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const userInfo = await oauth2.userinfo.get({ auth: oAuth2Client });

    const user = {
      name: userInfo.data.name,
      username: userInfo.data.given_name.toLowerCase() + '.' + userInfo.data.family_name.toLowerCase(),
      email: userInfo.data.email,
      google_id: tokens.access_token,
    };

    const response = await User.store(user);

    if (!response.length || response.error) {
      if (response.error === 409) {
        return res.json(response);
      }

      return res.json({ error: 503, message: "Internal Error" });
    }

    const id = response[0].id;
    const expiresIn = config.EXPIRES_IN;
    const token = jwt.sign({ id }, config.SECRET, { expiresIn });

    return res.json({
      user: { name: user.name, email: user.email },
      token: token,
      message: "Login with Google Successful",
    });

  } catch (error) {
    console.log(error);

    return res.json({
      error: 404,
      message: "Login with Google Failed",
    });
  }
};

const facebookSignIn = async () => { };

module.exports = { signIn, googleSignIn, googleOAuthCallback, facebookSignIn };