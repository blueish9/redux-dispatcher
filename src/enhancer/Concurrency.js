const Concurrency = (() => {
  const Events = (() => {
    const events = {};
    return {
      get(type) {
        if (!events[type]) {
          events[type] = {
            result: undefined,
            done: false,
            queue: []
          };
        }
        return events[type];
      },
      promise(type) {
        const callbackQueue = events[type].queue;
        return new Promise(resolve => {
          /**
           * important to declare a function with name "resolveEvent".
           * this name will be used to check if it needs to be removed from the callback queue
           */
          function resolveEvent(data) {
            return resolve(data);
          }

          callbackQueue.push(resolveEvent);
        });
      }
    };
  })();

  const waitResult = (type, listener) => {
    const event = Events.get(type);
    const callbackQueue = event.queue;

    if (typeof listener === 'function') {
      callbackQueue.push(listener);

      const unsubscribe = () => {
        const index = callbackQueue.indexOf(listener);
        if (index !== -1)
          callbackQueue.splice(index, 1);
      };
      unsubscribe.remove = unsubscribe;
      return unsubscribe;
    }

    if (event.done)
      return event.result;

    return Events.promise(type);
  };

  const injectResult = action => {
    const event = Events.get(action.type);
    event.done = false;

    const waitResult = (listener) => {
      return waitResult(action.type, listener);
    };

    const dispatchResult = data => {
      event.done = true;
      event.result = data;
      const callbackQueue = event.queue;
      if (callbackQueue) {
        // IMPORTANT: rethink about immutable
        let i = callbackQueue.length;
        while (i--) {
          const callback = callbackQueue[i];
          callback(data);
          if (callback.name === 'resolveEvent')
            callbackQueue.splice(i, 1);
        }
      }
    };

    Object.defineProperties(action, {
      waitResult: {value: waitResult},
      dispatchResult: {value: dispatchResult},
    });

    return action;
  };

  return {
    waitResult,
    injectResult
  };
})();

export default Concurrency;
