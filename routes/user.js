const { Router } = require("express");
const Controller = require("../src/user/controller");
const { encryptPassword } = require("../src/user/middleware");
const routes = Router();

routes.get("/users/me", Controller.getUserProfile);
routes.get("/users/:id", Controller.getProfile);
routes.post("/users", encryptPassword, Controller.createUser);
routes.put("/users/me", Controller.updateUserProfile);
routes.put("/users/me/confirm", Controller.confirmUser);
routes.put("/users/me/disable", Controller.disableUser);

module.exports = routes;
