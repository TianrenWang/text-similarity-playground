import express from "express";
import path from "path";

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// Put all API endpoints under '/api'
app.get("/search", (req, res) => {
  res.json([]);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
