const { Router } = require("express");
const Controller = require("../src/session/controller");
const Middleware = require("../src/session/middleware");
const routes = Router();

routes.post("/auth", Controller.signIn);
routes.post("/auth/google", Controller.googleSignIn);
routes.post("/auth/facebook", Controller.facebookSignIn);

module.exports = routes;
