const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const open = require('open');
const User = require("../user/model");
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { SECRET, EXPIRES_IN, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_CALLBACK } = require("./config");

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
      const token = jwt.sign({ id }, SECRET, { EXPIRES_IN });

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

// create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
// which should be downloaded from the Google Developers Console.
function getOAuthClientGoogle() {
  return new OAuth2Client(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_CALLBACK);
};

const googleSignIn = async (req, res) => {

  try {
    const oAuth2Client = await getOAuthClientGoogle();

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    // open the browser to the authorize url to start the workflow
    open(authorizeUrl, { wait: false }).then(cp => cp.unref());

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

  oAuth2Client.getToken(code, function (err, tokens) {
    // tokens contains an access_token and an optional refresh_token. Save them.
    // get profile user and save

    if (!err) {
      oAuth2Client.setCredentials(tokens);

      oAuth2Client.user

      return res.json({
        token: tokens.access_token,
        email: "email",
        message: "Login with Google Successful",
      });
    }

    return res.json({
      error: 404,
      message: "Login with Google Failed",
    });
  });
};

const facebookSignIn = async () => { };

module.exports = { signIn, googleSignIn, googleOAuthCallback, facebookSignIn };