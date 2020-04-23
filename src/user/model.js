const Pool = require("../db/");

//User.getMyself
const getMyself = async () => {};

//User.get
const get = async (id) => {
  try {
    const { rows } = await Pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows;
  } catch (error) {
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

//User.store
const store = async (user) => {
  const { name, username, email, password_hash, phone, document_id } = user;
  try {
    const response = await Pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (response.rows.length) {
      return {
        error: 409,
        message: "Email already exists",
      };
    }

    const {
      rows,
    } = await Pool.query(
      "INSERT INTO (name, username, email, password_hash, phone, document_id)",
      [name, username, email, password_hash, phone, document_id]
    );
  } catch (error) {
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

//User.update
const update = async () => {};

//User.confirm
const confirm = async () => {};

//User.disable
const disable = async () => {};

module.exports = { getMyself, get, store, update, confirm, disable };
