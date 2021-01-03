class ImList {
  constructor(data) {
    this.data = data
    const props = Object.getOwnPropertyNames(data.__proto__)
    const symbols = Object.getOwnPropertySymbols(data.__proto__)

    props.forEach(pr => {
      if (typeof data[pr] === 'function')
        this[pr] = (...args) => data[pr](...args)
      else
        this[pr] = data[pr]
    })

    symbols.forEach(sb => {
      this[sb] = (...args) => data[sb](...args)
    })
  }

  append = item => [...this.data, item]

  removeAt = index => {
    return [
      ...this.data.slice(0, index),
      ...this.data.slice(index + 1)
    ]
  }

  removeBy = predicate => {
    if (typeof predicate !== 'function') {
      const value = predicate
      predicate = item => item === value
    }
    const index = this.data.findIndex(predicate)
    if (index > -1)
      return this.removeAt(index)
    return this.data
  }

  toggle = (item, getKey) => {
    const parseKey = getKey ? getKey : (item => item)
    const index = this.data.findIndex(_item => parseKey(_item) === parseKey(item))
    if (index > -1)
      return this.removeAt(index)
    return this.append(item)
  }

  /*[Symbol.iterator] = function* () {
    for (let i = 0; i < this.data.length; ++i)
      yield this.data[i]
  }*/
}

const b = new ImList([1, 2, 3,])
console.log(b)


/*const ImList = data => {
  const append = item => [...data, item]

  const removeAt = index => {
    return [
      ...data.slice(0, index),
      ...data.slice(index + 1)
    ]
  }

  const removeBy = predicate => {
    if (typeof predicate !== 'function') {
      const value = predicate
      predicate = item => item === value
    }
    const index = data.findIndex(predicate)
    if (index > -1)
      return removeAt(index)
    return data
  }

  const toggle = (item, getKey) => {
    const parseKey = getKey ? getKey : (item => item)
    const index = data.findIndex(_item => parseKey(_item) === parseKey(item))
    if (index > -1)
      return removeAt(index)
    return append(item)
  }

  return {
    [Symbol.iterator]: function* () {
      for (let i = 0; i < data.length; ++i)
        yield data[i]
      //yield data
    },
    append,
    removeAt,
    removeBy,
    toggle
  }
}*/
