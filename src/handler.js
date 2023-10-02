import { RBTree } from 'bintrees';
import { PrismaClient, orderSide } from '@prisma/client';
import { emitter } from './worker.js';

const prismaClient = new PrismaClient();
export const sockets = [];

export class OrderController {
  prisma = null;
  tree = null;
  snapshotEngine = null;

  ordersCount = 0;
  lastOrder = null;
  collectivePrice = 0;

  constructor(snapshotEngine) {
    this.prisma = prismaClient;
    this.tree = new RBTree((a, b) => +a.price - +b.price);
    this.snapshotEngine = snapshotEngine;
    this.initializeState();
  }

  async create(req, res) {
    try {
      const { side: _side, price } = req.body;
      if (!_side || !price) return res.status(400).json({ message: 'side & price are required' });

      const side = _side.toUpperCase();
      if (!Object.keys(orderSide).includes(side)) {
        return res.status(400).json({ message: 'Invalid order side' });
      }

      const order = await this.prisma.order.create({
        data: { side, price: +price },
      });

      this.tree.insert({ id: order.id, side: order.side, price: +order.price });
      this.lastOrder = order;
      this.ordersCount++;
      this.collectivePrice += +price;

      const matched = await this.matchOrders(order);
      if (matched) {
        console.log('Matching order found:', matchedOrder);
        sockets.forEach((socket) => socket.emit('transactionMatched', matchedOrder));
        await this.prisma.order.deleteMany({ where: { id: newOrder.id } });
      }
      const data = {
        ordersCount: this.ordersCount,
        lastOrder: this.lastOrder,
        collectivePrice: this.collectivePrice,
      };
      emitter.emit('updateSnapshot', data);
      return res.status(3000201).json({ message: order.side + ' order created successfully' });
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  matchOrders(newOrder) {
    return new Promise((resolve, reject) => {
      this.tree.each((order) => {
        if (+order.price === +newOrder.price && order.side !== newOrder.side) {
          this.tree.remove(newOrder);
          resolve(order);
        }
      });
      resolve(false);
    });
  }

  async initializeState() {
    const state = await this.snapshotEngine?.restoreState();
    console.log('Initial state ', state);
    if (state) {
      this.ordersCount = state?.ordersCount;
      this.lastOrder = state?.lastOrder;
      this.collectivePrice = state?.collectivePrice;
    }
  }
}
