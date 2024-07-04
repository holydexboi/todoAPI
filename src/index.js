"use strict";
const fastify = require("fastify")({
  logger: true,
});
const path = require("node:path");
require("dotenv").config({ path: path.join("./config", ".env") });
fastify.register(require("./db-connection"));
fastify.register(require("./controller/task"));
//fastify.register(require("./controller/user"));

//fastify.mongo.db.collection().deleteOne()
const PORT = 3000 || process.env.PORT;
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
