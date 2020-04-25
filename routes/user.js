const { Router } = require("express");
const Controller = require("../src/user/controller");
const { encryptPassword } = require("../src/user/middleware");
const { checkAuthorization } = require("../src/session/middleware");
const routes = Router();

routes.get("/users/me", checkAuthorization, Controller.getUserProfile);
routes.get("/users/:id", checkAuthorization, Controller.getProfile);
routes.post("/users", encryptPassword, Controller.createUser);
routes.put("/users/me", checkAuthorization, encryptPassword, Controller.updateUserProfile);
routes.put("/users/me/confirm", checkAuthorization, Controller.confirmUser);
routes.put("/users/me/disable", checkAuthorization, Controller.disableUser);

module.exports = routes;
