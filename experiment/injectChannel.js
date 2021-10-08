const injectChannel = action => {
  let callback, payload;
  const queue = [];

  const put = data => {
    if (callback) {
      callback(data);
      callback = undefined;
    }
    queue.push(data);
    const _payload = payload;
    payload = undefined;
    return _payload;
  };

  const take = data => {
    payload = data;
    return new Promise(resolve => {
      if (queue.length < 1) {
        callback = resolve;
        return;
      }
      resolve(queue.shift());
    });
  };

  return {
    ...action,
    put,
    take
  };
};

export default injectChannel;
