import { parentPort } from 'worker_threads';
import { SnapshotEngine } from './snapshot.mjs';

const snapshotEngine = new SnapshotEngine();
let snapshotData = null;

parentPort.on('message', async (message) => {
  if (message.action === 'startSnapshot') {
    while (true) {
      if (snapshotData) await snapshotEngine.takeSnapshot(snapshotData);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } else if (message.action === 'updateSnapshot') {
    snapshotData = JSON.parse(message.data);
  }
});
