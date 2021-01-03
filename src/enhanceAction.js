export const withResult = dispatcher => {
  return (...args) => {
    const action = typeof dispatcher === 'function' ? dispatcher(...args) : dispatcher;

    let callback;

    const setResult = data => callback(data);

    const $result = () => {
      const promise = new Promise(resolve => callback = resolve);

      /**
       * provide an alternative way to set result when action is destructured:
       * const { $result } = withResult(...)(...)
       * $result.value = something
       */
      Object.defineProperty(promise, 'value', {
        set: setResult,
      });

      return promise;
    };

    Object.defineProperty(action, '$result', {
      set: setResult,
      get: $result
    });

    return action;
  };
};
