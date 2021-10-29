/*function* sync() {
  yield 1;
}

let gen = sync();

const enhance = (gn) => {
  const returnGen = (...args) => {
    console.log('return ', {args});
    return gen.return(...args);
  };
  const next = (...args) => {
    console.log('next ', {args});
    return gen.next(...args);
  };
  return {...gn, return: returnGen, next};
};

const gen2 = enhance(gen);

let res = gen2.next(1);
console.log({res});
res = gen2.return(123);
console.log({res});

return;*/

const END = Symbol('END');

const test_injectIterator = action => {
  const channel = (function* () {
    while (true) {
      const i = yield;
      if (i === END) {
        return;
      }
      console.log({i});
      // yield i;
      callback(i);
    }
  })();

  channel.next();

  let callback;
  const queue = [];
  const args = []

  return {
    ...action, channel,
    iterator: (data) => {
      console.log({data});
      if (callback) {
        callback(data);
        callback = undefined;
        return;
      }

      queue.push(data);
      return args.shift()
      //channel.next(data);
    },
    resolve(payload) {
      args.push(payload)
      return new Promise(resolve => {
        console.log({queue});
        queue.length === 0 ? (callback = resolve) : resolve(queue.shift());
      });
    }
  };
};

const action = test_injectIterator({});

const saga = function* ({put, iterator}) {
  //yield put(123);
  iterator(234);
  iterator(5665);
  iterator(9898);
};

(async () => {
  const {channel, resolve} = action;
  let a = await resolve();
  console.log({a});

  a = await resolve();
  console.log({a});
})();

setTimeout(() => {

  const worker = saga(action);
  worker.next();
  //worker.next()
  //console.log('worker', worker.next());
  //console.log('worker', worker.next());

}, 1000);
