const { getData, write } = require("../db");
const User = require("./model");

//Controller.getUserProfile
const getUserProfile = async () => {
  //TODO: Colocar o id salvo na sessao
  const id = 1;
  const response = await User.get(id);
  if (response.length) {
    const { id, name, username, email } = response[0];
    return res.json({ id, name, username, email, phone, document_id });
  }
};

//Controller.getProfile
const getProfile = async (req, res) => {
  const id = req.params.id;
  const response = await User.get(id);
  if (response.length) {
    const { id, name, username, email } = response[0];
    return res.json({ id, name, username, email, phone, document_id });
  }
};

//Controller.createUser
const createUser = async (req, res) => {
  const { name, username, email, password_hash, phone, document_id } = req.body;
  const user = { name, username, email, password_hash, phone, document_id };

  const response = await User.createUser({ ...user, password_hash });

  if (!response.length || response.error) {
    if (response.error === 409) {
      return res.json(response);
    }

    return res.json({ error: 503, message: "Internal Error" });
  }

  return res.json({ ...user, id: response[0].id });
};

//Controller.updateUserProfile
const updateUserProfile = async () => {
  //Colocar o id salvo na sessao
  const id = 1;
  const { name, username, email, password_hash, phone, document_id } = req.body;
  if (!name || !username || !email || !phone || !document_id) {
    return res.json({ error: 400, message: "Empty required fiels" });
  }
};

//Controller.confirmUser
const confirmUser = async () => {};

//Controller.disableUser
const disableUser = async () => {};

module.exports = {
  getUserProfile,
  getProfile,
  createUser,
  updateUserProfile,
  confirmUser,
  disableUser,
};
