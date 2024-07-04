async function routes(fastify, options) {
  const Task = fastify.mongo.db.collection("task");

  const taskJsonSchema = {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      status: { type: "string" },
      user: { type: "string" },
      due_date: { type: "string" },
      createdDate: { type: "string" },
      updatedDate: { type: "string" },
    },
  };

  const schema = {
    body: taskJsonSchema,
  };

  fastify.get("/task/tasks", async (request, reply) => {
    console.log(request.query);
    const tasks = await Task.find().toArray();

    return tasks;
  });

  fastify.get("/task/:id", async (request, reply) => {
    const id = new fastify.mongo.ObjectId(request.params.id);
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return reply.code(400).send("No task with the given Id");
    }

    return task;
  });

  fastify.post("/task/create", { schema }, async (request, reply) => {
    const { title, due_date } = request.body;
    const description = request.body.description
      ? request.body.description
      : "";
    const post = await Task.insertOne({
      title,
      description,
      due_date,
      status: "pending",
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    return post;
  });

  fastify.put("/task/edit/:id", async (request, reply) => {
    const id = new fastify.mongo.ObjectId(request.params.id);
    const checkTask = await Task.findOne({ _id: id });
    if (!checkTask) {
      return reply.code(400).send("No task with the given Id");
    }
    const title = request.body.title ? request.body.title : checkTask.title;
    const description = request.body.body
      ? request.body.description
      : checkTask.description;
    const due_date = request.body.due_date
      ? request.body.due_date
      : checkTask.due_date;
    const status = request.body.status ? request.body.status : checkTask.status;
    const task = await Task.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          description: description,
          title,
          due_date,
          status,
          updatedDate: new Date(),
        },
      }
    ).catch((err) => {
      throw new Error(err.message);
    });

    return task;
  });

  fastify.delete("/task/delete/:id", async (request, reply) => {
    const id = new fastify.mongo.ObjectId(request.params.id);
    const checkTask = await Task.findOne({ _id: id });
    if (!checkTask) {
      return reply.code(400).send("No task with the given Id");
    }

    const task = await Task.deleteOne({ _id: id });

    return task;
  });
}

module.exports = routes;
