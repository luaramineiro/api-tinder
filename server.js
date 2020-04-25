const express = require("express");
const { config } = require("./config");
const server = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

server.use(express.json());

// Routes
server.use(authRoutes);
server.use(userRoutes);

server.listen(config.PORT, () => {
  console.log(`Running the server in the ${config.PORT} port!`);
});
