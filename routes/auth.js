const { Router } = require("express");
const Controller = require("../src/session/controller");
const routes = Router();

routes.post("/auth", Controller.signIn);
routes.post("/auth/google", Controller.googleSignIn);
routes.get("/auth/google/callback", Controller.googleOAuthCallback);
routes.post("/auth/facebook", Controller.facebookSignIn);

module.exports = routes;
