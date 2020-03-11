/**
 * Author: Quan Vo
 * Date: 2019-11-27
 */

export const assign = (state, payload) => payload

export const removeAt = (path, index) => (state, payload) => {
  index = payload[index]
  return {
    [path]: [
      ...state[path].slice(0, index),
      ...state[path].slice(index + 1)
    ]
  }
}



removeAt('listUser', 'userIndex')
