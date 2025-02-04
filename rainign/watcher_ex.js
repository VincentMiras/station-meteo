import Watcher from 'watcher';

const watcher = new Watcher ( '../rasp/dev/shm/rainCounter.log' );

watcher.on ( 'change', filePath => {
    console.log ( filePath ); // "filePath" just got modified
  });