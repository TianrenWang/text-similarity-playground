require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const { getSimilarVectors } = require("./vector_functions");
const app = express();

const distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/api/similar_texts", (req, res) => {
  getSimilarVectors(req.query.text, req.query.topk)
    .then((vectors) => res.json(vectors))
    .catch((error) => {
      res.json({ error: error.message });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => console.log("Successfully started server"));
