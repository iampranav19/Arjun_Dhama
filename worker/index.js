require("dotenv").config();

const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const mongoose = require("mongoose");

const Deployment = require("../server/models/Deployment");

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

console.log("Connecting MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Worker MongoDB Connected");
  })
  .catch((err) => {
    console.error(err);
  });

console.log("Starting worker...");

const worker = new Worker(
  "deployments",

  async (job) => {

    console.log("JOB RECEIVED");
    console.log(job.data);

    const deployment = await Deployment.findById(
      job.data.deploymentId
    );

    if (!deployment) {
      console.log("Deployment not found");
      return;
    }

    deployment.status = "Running";
    await deployment.save();

    console.log("Status changed to Running");

    // Fake deployment delay
    await new Promise((resolve) =>
      setTimeout(resolve, 5000)
    );

    deployment.status = "Completed";
    await deployment.save();

    console.log("Status changed to Completed");
  },

  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed: ${err.message}`);
});

console.log("Worker started...");