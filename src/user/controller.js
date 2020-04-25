const axios = require('axios');
const { API_KEY_SEND_EMAIL, URL_SEND_EMAIL } = require("../sendinblue/config");
const User = require("./model");

//Controller.getUserProfile
const getUserProfile = async (req, res) => {
  const id = req.body.id;
  const response = await User.get(id);
  if (response.length) {
    const { name, username, email, phone } = response[0];
    return res.json({ name, username, email, phone });
  }

  return res.json({
    error: 409,
    message: "User Not Found",
  });
};

//Controller.getProfile
const getProfile = async (req, res) => {
  const id = req.params.id;
  const response = await User.get(id);
  if (response.length) {
    const { name, username, email, phone } = response[0];
    return res.json({ name, username, email, phone });
  }

  return res.json({
    error: 409,
    message: "User Not Found",
  });
};

//Controller.createUser
const createUser = async (req, res) => {
  const { name, username, email, password_hash, phone } = req.body;

  if (!name || !username || !email || !phone) {
    return res.json({ error: 400, message: "Empty required fields" });
  }

  const user = { name, username, email, password_hash, phone };

  const response = await User.store({ ...user, password_hash });

  if (!response.length || response.error) {
    if (response.error === 409) {
      return res.json(response);
    }

    return res.json({ error: 503, message: "Internal Error" });
  }

  return res.json({ ...user, id: response[0].id });
};

//Controller.updateUserProfile
const updateUserProfile = async (req, res) => {

  const { name, username, email, phone } = req.body;

  if (!name || !username || !email || !phone) {
    return res.json({ error: 400, message: "Empty required fields" });
  }

  const response = await User.update(req.body);

  if (!response.length || response.error) {
    if (response.error === 409) {
      return res.json(response);
    }

    return res.json({ error: 503, message: "Internal Error" });
  }

  const user = { name, username, email, phone, update_at: response[0].updated_at.toISOString() };

  return res.json(user);
};

//Controller.confirmUser
const confirmUser = async (req, res) => {
  const id = req.body.id;
  const response = await User.get(id);
  if (response.length) {

    const user = response[0];

    try {
      const responseSendEmail = await axios({
        method: "POST",
        url: URL_SEND_EMAIL,
        headers: { "content-type": "application/json", "api-key": API_KEY_SEND_EMAIL },
        data: {
          sender: { "name": "Tinder", "email": "tinder@cubos.io" },
          to: [{ "email": `${user.email}`, "name": `${user.name}` }],
          replyTo: { "email": "luara.mineiro@cubos.io", "name": "Luara Mineiro" },
          subject: "Email confirmação Tinder Cubos",
          htmlContent: "<body> <p>Hellouuu,</p> Bem vindo ao tinder! </body>",
          textContent: "Teste tinder api"
        }
      });

      return res.json({
        messageId: responseSendEmail.data.messageId,
        message: "E-mail send with success",
      });
    } catch (error) {
      //console.error(error.response.status);
      //console.error(error.response.data);

      return res.json({
        error: 400,
        message: "Bad request to Sendinblue",
      });
    }
  }

  return res.json({
    error: 409,
    message: "User Not Found",
  });
};

//Controller.disableUser
const disableUser = async (req, res) => {
  const id = req.body.id;
  const response = await User.disable(id);
  if (response.length) {
    const user = {
      username: response[0].username,
      email: response[0].email,
      deleted_at: response[0].deleted_at.toISOString()
    };
    return res.json(user);
  }
};

module.exports = {
  getUserProfile,
  getProfile,
  createUser,
  updateUserProfile,
  confirmUser,
  disableUser,
};
