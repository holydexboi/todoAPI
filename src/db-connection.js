const fastifyPlugin = require("fastify-plugin");
require("dotenv").config({ path: "./config/env" });

async function dbConnector(fastify, options) {
  const db = process.env.MONGO_URL;
  fastify.register(require("@fastify/mongodb"), {
    url: db,
  });
}

module.exports = fastifyPlugin(dbConnector);
