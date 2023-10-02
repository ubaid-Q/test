import { RedisEngine } from './redisEngine.mjs';

export class SnapshotEngine {
  redisEngine;

  constructor() {
    this.redisEngine = new RedisEngine();
  }
  takeSnapshot({ ordersCount, lastOrder, collectivePrice }) {
    return this.redisEngine.setSnapshot('orderState', {
      ordersCount,
      lastOrder,
      collectivePrice,
    });
  }

  async restoreState() {
    return this.redisEngine.getSnapshot('orderState');
  }
}
