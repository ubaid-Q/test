import { Router } from 'express';
import { OrderController } from './handler.js';
import { SnapshotEngine } from './utils/snapshot.mjs';

export const route = Router();

const order = new OrderController(new SnapshotEngine());

route.post('/', order.create.bind(order));
