class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = (process.env.CACHE_TTL_MINUTES || 5) * 60 * 1000; // Convert to milliseconds

    // Clean up expired entries every 10 minutes
    setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, {
      value,
      expiry,
    });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    const deleted = this.cache.delete(key);

    return deleted;
  }

  clear() {
    const size = this.cache.size;
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      ttlMinutes: this.ttl / (60 * 1000),
      entries: Array.from(this.cache.keys()),
    };
  }
}

module.exports = new CacheService();
