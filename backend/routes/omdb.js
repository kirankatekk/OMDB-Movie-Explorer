// routes/omdb.js
const express = require("express");
const axios = require("axios");

function makeRouter({ omdbKey, cache, cacheTtlSec }) {
  const router = express.Router();
  const OMDB_BASE = "https://www.omdbapi.com/";

  // Search endpoint
  router.get("/search", async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      if (!q) return res.status(400).json({ error: "missing query q" });

      const type = (req.query.type || "").trim();
      const page = (req.query.page || "1").toString();
      const key = `search:${q.toLowerCase()}:${type}:${page}`;

      const cached = await cache.get(key);
      if (cached) return res.json({ source: "cache", data: cached });

      const params = { s: q, apikey: omdbKey, page };
      if (type) params.type = type;

      const r = await axios.get(OMDB_BASE, { params });
      if (r.data.Response === "False") {
        return res.status(404).json({ error: r.data.Error || "Not found" });
      }

      // Simplify results (defensive check)
      const simplified = Array.isArray(r.data.Search)
        ? r.data.Search.map((item) => ({
            imdbID: item.imdbID,
            title: item.Title,
            year: item.Year,
            type: item.Type,
            poster: item.Poster === "N/A" ? null : item.Poster,
          }))
        : [];

      await cache.set(key, simplified, cacheTtlSec);
      return res.json({ source: "omdb", data: simplified });
    } catch (err) {
      console.error("Search error:", err?.message || err);
      return res.status(500).json({ error: "internal_error" });
    }
  });

  // Movie detail
  router.get("/movie/:id", async (req, res) => {
    try {
      const id = (req.params.id || "").trim();
      if (!id) return res.status(400).json({ error: "missing id" });

      const key = `movie:${id}`;
      const cached = await cache.get(key);
      if (cached) return res.json({ source: "cache", data: cached });

      const params = { i: id, apikey: omdbKey, plot: "full" };
      const r = await axios.get(OMDB_BASE, { params });

      if (r.data.Response === "False") {
        return res.status(404).json({ error: r.data.Error || "Not found" });
      }

      const payload = r.data;
      await cache.set(key, payload, cacheTtlSec);
      return res.json({ source: "omdb", data: payload });
    } catch (err) {
      console.error("Movie detail error:", err?.message || err);
      return res.status(500).json({ error: "internal_error" });
    }
  });

  return router;
}

module.exports = makeRouter;
