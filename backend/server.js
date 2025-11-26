// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const makeCache = require("./lib/cache");
const makeOmdbRouter = require("./routes/omdb");
const path = require("path");

async function main() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  const PORT = process.env.PORT || 4000;
  const omdbKey = process.env.OMDB_API_KEY;

  if (!omdbKey) {
    console.error("OMDB_API_KEY missing in env");
    process.exit(1);
  }

  const cache = await makeCache({
    useRedis: process.env.USE_REDIS === "true",
    redisUrl: process.env.REDIS_URL,
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS || "500", 10),
    ttlSec: parseInt(process.env.CACHE_TTL_SECONDS || "3600", 10),
  });

  const omdbRouter = makeOmdbRouter({
    omdbKey,
    cache,
    cacheTtlSec: parseInt(process.env.CACHE_TTL_SECONDS || "3600", 10),
  });
  

  // ---- API ROUTES ----
  app.use("/api", omdbRouter);
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // ---- SERVE FRONTEND BUILD ----
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("dist", "index.html"));
});


  // ---- START SERVER ----

app.listen(PORT, () => {
  console.log(`OMDB backend running on port ${PORT}`);
});

}

main();
