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
      createdDate: { type: "string" },
      updatedDate: { type: "string" },
    },
  };

  const schema = {
    body: userJsonSchema,
  };

  fastify.get("/user/:id", async (request, reply) => {
    const id = new fastify.mongo.ObjectId(request.params.id);
    const user = await User.findOne({ _id: id });
    if (!user) {
      return reply.code(400).send("No user with the given Id");
    }

    return user;
  });

  fastify.post("/user/create", { schema }, async (request, reply) => {
    const username = request.body.username;
    const password = await bcrypt.hash(request.body.password, 10);
    const user = await User.insertOne({
      username,
      password,
      createdDate: new Date(),
      updatedDate: new Date(),
    });

    const token = jwt.sign(
      { id: user.insertedId, username },
      process.env.jwtToken
    );
    const userDetails = { id: user.insertedId, username };
    return (data = {
      user: userDetails,
      token,
    });
  });
}

module.exports = routes;
