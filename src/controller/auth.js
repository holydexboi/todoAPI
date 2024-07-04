const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config({ path: "./config/env" });

async function routes(fastify, options) {
  const User = fastify.mongo.db.collection("user");

  const userJsonSchema = {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      paassword: { type: "string" },
    },
  };

  const schema = {
    body: userJsonSchema,
  };

  fastify.post("/signin", { schema }, async (request, reply) => {
    const username = request.body.username;
    const password = request.body.password;
    const user = await User.findOne({ username });
    if (!user) {
      return reply.code(400).send("Invalid username or password");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return reply.code(400).send("Invalid username or password");
    }

    const token = jwt.sign(
      _.pick(user, ["_id", "username"]),
      process.env.jwtToken
    );
    const userDetails = _.pick(user, ["_id", "username"]);
    return (data = {
      user: userDetails,
      token,
    });
  });
}

module.exports = routes;
