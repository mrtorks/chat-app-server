const express = require("express");
const cors = require("micro-cors");
const router = express.Router();

const handler = router.get("/", (req, res) => {
  res.send("server is up and running");
  if (req.method === "OPTIONS") {
    return response.status(200).send("ok");
  }
});

module.exports = cors(handler);
