import { Worker, isMainThread } from 'worker_threads';
import EventEmitter from 'events';

export const emitter = new EventEmitter();

if (isMainThread) {
  const snapshotWorker = new Worker('./src/utils/snapshotWorker.mjs');

  snapshotWorker.postMessage({ action: 'startSnapshot' });

  emitter.on('updateSnapshot', (data) => {
    snapshotWorker.postMessage({
      action: 'updateSnapshot',
      data: JSON.stringify(data),
    });
  });
}
