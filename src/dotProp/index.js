export default function withSet(state) {
  const withState = {...state}
  withState.set = (path, value) => set(withState, path, value)
  return withState
}


/**
 * The following functions are taken from https://github.com/sindresorhus/dot-prop/blob/master/index.js
 */
function set(object, path, value) {
  if (!isObj(object) || typeof path !== 'string') {
    return object
  }

  const root = object
  const pathArray = getPathSegments(path)

  for (let i = 0; i < pathArray.length; i++) {
    const p = pathArray[i]

    if (!isObj(object[p])) {
      object[p] = {}
    }

    if (i === pathArray.length - 1) {
      object[p] = value
    }

    object = object[p]
  }

  return root
}

const disallowedKeys = [
  '__proto__',
  'prototype',
  'constructor'
];

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.includes(segment));

function getPathSegments(path) {
  const pathArray = path.split('.');
  const parts = [];

  for (let i = 0; i < pathArray.length; i++) {
    let p = pathArray[i];

    while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = p.slice(0, -1) + '.';
      p += pathArray[++i];
    }

    parts.push(p);
  }

  if (!isValidPath(parts)) {
    return [];
  }

  return parts;
}


/**
 * this function is taken from https://github.com/sindresorhus/is-obj/blob/master/index.js
 */
const isObj = value => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};
