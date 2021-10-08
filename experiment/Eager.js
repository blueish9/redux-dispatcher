const Eager = (() => {
  const events = {};

  const register = async action => {
    const name = action.type;
    if (events[name])
      events[name].action = action;
    else
      events[name] = {action};

    const result = await action.$result;
    delete events[name].action;

    events[name].result = result;
    return result;
  };

  const sync = async (name, fallback) => {
    if (events[name]) {
      let {action, result} = events[name];
      if (action) {
        fallback && typeof fallback.show === 'function' && fallback.show();
        result = await action.$result;
        fallback && typeof fallback.hide === 'function' && fallback.hide();
      }
      return result;
    }
  };

  const withRecordEvent = (action, effect) => () => {
    const promise = effect();
    register({...action, $result: promise});
    return promise;
  };

  return {
    sync,
    withRecordEvent
  };
})();

export default Eager;
