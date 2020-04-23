const express = require("express");
const { PORT } = require("./config");
const server = express();
//const authRoutes = require("./routes/auth");
//const userRoutes = require("./routes/user");

server.use(express.json());

//server.use(authRoutes);
//server.use(userRoutes);

server.listen(PORT);
