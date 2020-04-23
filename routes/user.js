const { Router } = require("express");
const Controller = require("./src/user/controller");
const routes = Router();

routes.get("/users", Controller.getAllUsers);
routes.get("/users/:id", Controller.getProfile);
routes.post("/users", Controller.createUser);
routes.put("/users/me", Controller.updateUserProfile);
routes.put("/users/me/confirm", Controller.confirmUser);
routes.put("/users/me/confirm", Controller.disableUser);

module.exports = routes;
