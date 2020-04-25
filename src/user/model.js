const Pool = require("../db/");

//User.getMyself
const getMyself = async (email) => {
  try {
    const { rows } = await Pool.query("SELECT * FROM users WHERE email = $1 and deleted_at IS NULL", [
      email,
    ]);

    return rows;
  } catch (error) {
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

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
  const { name, username, email, password_hash, phone } = user;
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

    const { rows } = await Pool.query(
      "INSERT INTO users (name, username, email, password_hash, phone) VALUES ($1, $2, $3, $4, $5)  RETURNING *",
      [name, username, email, password_hash, phone]
    );

    return rows;

  } catch (error) {
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

//User.update
const update = async (user) => {
  const { id, name, username, email, phone } = user;

  try {
    const response = await Pool.query("SELECT id FROM users WHERE id = $1", [id]);
    if (!response.rows.length) {
      return {
        error: 409,
        message: "User Not Found",
      };
    }

    const { rows } = await Pool.query(
      "UPDATE users SET name = $1, username = $2, email = $3, phone = $4, updated_at = NOW() WHERE id = $5  RETURNING *",
      [name, username, email, phone, id],
    );

    return rows;

  } catch (error) {
    console.log(error);
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

//User.confirm
const confirm = async () => { };

//User.disable
const disable = async (id) => {
  try {
    const { rows } = await Pool.query("UPDATE users SET deleted_at = NOW() WHERE id = $1  RETURNING *", [
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

module.exports = {
  getMyself,
  get,
  store,
  update,
  confirm,
  disable,
};
