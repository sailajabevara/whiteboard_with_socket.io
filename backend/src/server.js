
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/* HEALTH CHECK API */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});