require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const { getSimilarVectors, indexMessage } = require("./vector_functions");
const app = express();

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use(cors());
app.use(express.json({ limit: "25mb" }));

const PORT = process.env.PORT || 3001;

app.get("/api/similar_texts", (req, res) => {
  getSimilarVectors(req.query.text, req.query.topk, req.query.namespace)
    .then((vectors) => res.json(vectors))
    .catch((error) => {
      res.json({ error: error.message });
    });
});

app.post("/api/text", (req, res) => {
  indexMessage(req.body.text, req.query.namespace)
    .then(() => res.json({ message: "Vector was successfully index." }))
    .catch((error) => {
      res.json({ error: error.message });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => console.log("Successfully started server"));
