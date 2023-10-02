import Redis from 'ioredis';

export class RedisEngine {
  redis;

  constructor() {
    this.redis = new Redis();
  }

  async setSnapshot(key, value) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async getSnapshot(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
}
