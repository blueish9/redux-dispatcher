import {withResult} from '../src';

const test1 = async () => {
  const action = withResult({})();

  setTimeout(() => action.$result = 123, 2000);

  const result = await action.$result;
  console.log('result', result);
};

const test2 = async () => {
  const {id, $result} = withResult(id => ({id}))(99);

  setTimeout(() => $result.value = 456, 2000);

  const result = await $result;
  console.log('result', result);
};
