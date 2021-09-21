import identity from 'lodash/fp/identity'
import * as utils from '@/lib/utils'

describe('includesIn', () => {
  test('returns true if value is included in array', () => {
    expect(utils.includesIn([1, 2, 3], 1)).toBe(true)
  })

  test('returns false if value is not included in array', () => {
    expect(utils.includesIn([1, 2, 3], 4)).toBe(false)
  })

  test('can be called curried', () => {
    const includesInArray = utils.includesIn([1, 2, 3])

    expect(includesInArray(1)).toBe(true)
  })
})

describe('momentFormat', () => {
  test('formats a timestamp with momentjs', () => {
    const result = utils.momentFormat('MM-DD-YYYY \n HH:mm', '2019-03-27 00:00')
    expect(result).toBe('03-27-2019  00:00')
  })

  test('can be called curried', () => {
    const formatAsMMDDYYY = utils.momentFormat('MM-DD-YYYY \n HH:mm')

    expect(formatAsMMDDYYY('2019-03-27 00:00')).toBe('03-27-2019  00:00')
  })
})

describe('getIn', () => {
  test('gets a properties value from an object', () => {
    const result = utils.getIn({ foo: 'bar' }, 'foo')
    expect(result).toBe('bar')
  })

  test('can be called curried', () => {
    const getFromObject = utils.getIn({ foo: 'bar' })
    expect(getFromObject('foo')).toBe('bar')
  })
})

describe('wrapInProperty', () => {
  test('wraps value in object with provided property', () => {
    const result = utils.wrapInProperty('one', 1)
    expect(result).toMatchObject({ one: 1 })
  })

  test('can be called curried', () => {
    const wrapInFoo = utils.wrapInProperty('foo')
    expect(wrapInFoo(1)).toMatchObject({ foo: 1 })
  })
})

describe('when', () => {
  test('executes only truthy function with value', () => {
    const pred = jest.fn(() => true)
    const truthy = jest.fn(() => 'truthy value')
    const falsy = jest.fn(() => {})
    const result = utils.when(pred, truthy, falsy, 1)
    expect(pred).toHaveBeenCalledWith(1)
    expect(truthy).toHaveBeenCalledWith(1)
    expect(falsy).not.toHaveBeenCalled()
    expect(result).toBe('truthy value')
  })

  test('executes only falsy function with value', () => {
    const pred = jest.fn(() => false)
    const truthy = jest.fn(() => {})
    const falsy = jest.fn(() => 'falsy value')
    const result = utils.when(pred, truthy, falsy, 0)
    expect(pred).toHaveBeenCalledWith(0)
    expect(falsy).toHaveBeenCalledWith(0)
    expect(truthy).not.toHaveBeenCalled()
    expect(result).toBe('falsy value')
  })

  test('can be called curried', () => {
    const pred = jest.fn(() => true)
    const truthy = jest.fn(() => {})
    const falsy = jest.fn(() => {})
    utils.when(pred)(truthy)(falsy)(1)
    expect(pred).toHaveBeenCalledWith(1)
    expect(truthy).toHaveBeenCalledWith(1)
    expect(falsy).not.toHaveBeenCalled()
  })
})

describe('applyTo', () => {
  test('calls all functions with the provided argument', () => {
    const fn1 = jest.fn(() => {})
    const fn2 = jest.fn(() => {})
    utils.applyTo([fn1, fn2], 1)
    expect(fn1).toHaveBeenCalledWith(1)
    expect(fn2).toHaveBeenCalledWith(1)
  })

  test('can be called curried', () => {
    const fn1 = jest.fn(() => {})
    const fn2 = jest.fn(() => {})
    utils.applyTo([fn1, fn2])(1)
    expect(fn1).toHaveBeenCalledWith(1)
    expect(fn2).toHaveBeenCalledWith(1)
  })
})

describe('tap', () => {
  test('logs the value and returns it', () => {
    console.log = jest.fn() // eslint-disable-line
    const result = utils.tap(1)
    expect(console.log).toHaveBeenCalledWith(1) // eslint-disable-line
    expect(result).toBe(1)
  })
})

describe('tapWith', () => {
  test('logs the value prefixed with value and returns it', () => {
    console.log = jest.fn() // eslint-disable-line
    const result = utils.tapWith('prefix', 1)
    expect(console.log).toHaveBeenCalledWith('prefix', 1) // eslint-disable-line
    expect(result).toBe(1)
  })

  test('can be called curried', () => {
    console.log = jest.fn() // eslint-disable-line
    const result = utils.tapWith('prefix')(1)
    expect(console.log).toHaveBeenCalledWith('prefix', 1) // eslint-disable-line
    expect(result).toBe(1)
  })
})

describe('mapAsync', () => {
  test('maps over an array with an async function', async () => {
    const fn = msg =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(msg.toUpperCase())
        }, 500)
      })
    const arr = ['first', 'second', 'third']
    const result = await utils.mapAsync(fn, arr)
    expect(result).toMatchObject(['FIRST', 'SECOND', 'THIRD'])
  })
  test('can be called curried', async () => {
    const fn = msg =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(msg.toUpperCase())
        }, 500)
      })
    const arr = ['first', 'second', 'third']
    const result = await utils.mapAsync(fn)(arr)
    expect(result).toMatchObject(['FIRST', 'SECOND', 'THIRD'])
  })
})

describe('filterBy', () => {
  test('filters a collection based on a provided object', () => {
    const collection = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 }
    ]
    const result = utils.filterBy({ a: 4 }, collection)
    expect(result).toEqual([collection[1]])
  })
  test('can be called curried', () => {
    const collection = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 }
    ]
    const result = utils.filterBy({ a: 4 })(collection)
    expect(result).toEqual([collection[1]])
  })
})

describe('freeze', () => {
  test('clones an object and returns it frozen', () => {
    const a = { b: 1 }
    const result = utils.freeze(a)
    expect(Object.isFrozen(result)).toBe(true)
  })
})

describe('then', () => {
  test('executes the then method with the provided callback on a promise', async () => {
    const promise = Promise.resolve('foo')
    const result = await utils.then(identity, promise)
    expect(result).toBe('foo')
  })
})
