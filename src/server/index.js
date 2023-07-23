const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("/app/public"));

// Put all API endpoints under '/api'
app.get("/search", (req, res) => {
  res.json([]);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join("/app/public/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port);
