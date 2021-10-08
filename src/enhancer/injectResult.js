export const withResult = dispatcher => {
  return (...args) => {
    const action = typeof dispatcher === 'function' ? dispatcher(...args) : (dispatcher || {});
    return injectResult(action);
  };
};

export const injectResult = action => {
  let callback;

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

  // `callback` is actually `resolve` (from Promise) at the time setter is called
  const setResult = data => callback(data);

  Object.defineProperty(action, '$result', {
    get: $result,
    set: setResult,
  });

  return action;
};
