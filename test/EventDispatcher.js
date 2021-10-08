const _action = {type: 'hihi'};

const action = Concurrency.injectResult(_action);

const saga = function* ({channel, waitResult}) {
  waitResult({name: '123'})
  /*console.log({channel});
  channel.a = 1;
  channel.b = 2;*/
};

(async () => {
  Concurrency.waitResult(action.type, function (res) {
    console.log({res});
  });
  Concurrency.waitResult(action.type, function (res) {
    console.log('aaaa', {res});
  });
})();

(async () => {
  const res = await Concurrency.waitResult(action.type);
  console.log('await', res);
})();

setTimeout(() => {
  const worker = saga(action);
  worker.next();
}, 1000);


/*
Object.defineProperty(action, 'channel', {
  get: () => {
    return new Proxy({}, {
      set: function (target, field, value) {
        target[field] = value;
        const callbackQueue = events[action.type];
        callbackQueue.forEach(callback => callback(target));
      }
    });

    function* worker() {
      while (true) {
        const data = yield;
        if (data === END)
          return;

        const callbackQueue = events[action.type];
        callbackQueue.forEach(callback => {
          callback(data);
        });
      }
    }

    const channel = worker();
    channel.next();
    return channel;
  }
});*/


/*
const channel = new Proxy({}, {
  set: function (target, field, value) {
    target[field] = value;
    const callbackQueue = events[action.type];
    if (callbackQueue) {
      // IMPORTANT: rethink about immutable
      events[action.type] = callbackQueue.filter(callback => {
        if (callback.name === 'resolveEvent') {
          callback({[field]: value});
          return false;
        }
        callback(target);
        return true;
      });
    }
  }
});*/
