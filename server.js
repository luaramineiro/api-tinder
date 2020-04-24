const express = require("express");
const { config } = require("./config");
const server = express();
const authRoutes = require("./routes/auth");

server.use(express.json());

// Routes
server.use(authRoutes);

server.listen(config.PORT, () => {
  console.log(`Running the server in the ${config.PORT} port!`);
});
