import * as utils from '../../../lib/utils'

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
    const result = utils.momentFormat(
      'MM-DD-YYYY \n HH:mm',
      '2019-03-27T00:00:00Z',
    )
    expect(result).toBe('03-27-2019  01:00')
  })

  test('can be called curried', () => {
    const formatAsMMDDYYY = utils.momentFormat('MM-DD-YYYY \n HH:mm')

    expect(formatAsMMDDYYY('2019-03-27T00:00:00Z')).toBe('03-27-2019  01:00')
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
    const truthy = jest.fn(() => {})
    const falsy = jest.fn(() => {})
    utils.when(truthy, falsy, 1)
    expect(truthy).toHaveBeenCalledWith(1)
    expect(falsy).not.toHaveBeenCalled()
  })

  test('executes only falsy function with value', () => {
    const truthy = jest.fn(() => {})
    const falsy = jest.fn(() => {})
    utils.when(truthy, falsy, 0)
    expect(falsy).toHaveBeenCalledWith(0)
    expect(truthy).not.toHaveBeenCalled()
  })

  test('can be called curried', () => {
    const truthy = jest.fn(() => {})
    const falsy = jest.fn(() => {})
    utils.when(truthy)(falsy)(1)
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
    console.log = jest.fn()
    const result = utils.tap(1)
    expect(console.log).toHaveBeenCalledWith('tap:', 1)
    expect(result).toBe(1)
  })
})
