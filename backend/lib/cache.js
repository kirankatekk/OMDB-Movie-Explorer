const LRU = require("lru-cache");
let createClient = null;
try {
  createClient = require('redis').createClient;
} catch (e) {
  // Redis not installed — OK if USE_REDIS=false
}


module.exports = async function makeCache(cfg) {
  cfg = cfg || {};
  const useRedis = cfg.useRedis;

  if (useRedis) {
    const client = createClient({ url: cfg.redisUrl });
    await client.connect();
    return {
      async get(key) {
        const v = await client.get(key);
        return v ? JSON.parse(v) : null;
      },
      async set(key, value, ttlSec) {
        await client.set(key, JSON.stringify(value), { EX: ttlSec });
      },
      async del(key) {
        await client.del(key);
      },
    };
  }

  // In-memory LRU cache
  const cache = new LRU({
    max: cfg.maxItems || 500,
    ttl: (cfg.ttlSec || 3600) * 1000,
  });
  return {
    async get(key) {
      return cache.get(key) || null;
    },
    async set(key, value, ttlSec) {
      cache.set(key, value, { ttl: (ttlSec || cfg.ttlSec || 3600) * 1000 });
    },
    async del(key) {
      cache.delete(key);
    },
  };
};
