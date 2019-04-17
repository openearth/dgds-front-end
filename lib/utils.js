import includes from 'lodash/includes'
import get from 'lodash/get'
import curry from 'lodash/curry'
import moment from 'moment'

/**
 * Returns true if value is included in array
 *
 * @example
 * includes([1,2,3], 1) // true
 */
export const includesIn = curry(includes, 2)

/**
 * Formats a timestamp with momentjs
 *
 * @example
 * momentFormat('MM-DD-YYYY \n HH:mm', '2019-03-27T00:00:00Z') // '03-27-2019  01:00'
 */
export const momentFormat = curry((format, value) =>
  moment(value).format(format),
)

/**
 * Gets a properties value from an object
 *
 * @example
 * getIn({ foo: 'bar' }, 'foo') // 'bar
 */
export const getIn = curry(get, 2)

/**
 * Wraps value in object with provided property
 *
 * @example
 * wrapInProperty('one', 1) // { one: 1 }
 */
export const wrapInProperty = curry((property, value) => ({
  [property]: value,
}))

/**
 * Executes the truthy function when the provided value is trythy.
 * Executes the falsy function when the provided value is falsy.
 * Both functions are provided with the value as the first argument
 *
 * @example
 * const truthy = jest.fn(() => {})
 * const falsy = jest.fn(() => {})
 * when(truthy, falsy, 1) // truthy has been called
 * when(truthy, falsy, 0) // falsy has been called
 */
export const when = curry((truthy, falsy, value) =>
  value ? truthy(value) : falsy(value),
)

export const whenBy = curry((pred, truthy, falsy, value) =>
  pred(value) ? truthy(value) : falsy(value),
)

/**
 * Calls all functions with the provided argument
 *
 * @example
 * const fn1 = () => {}
 * const fn2 = () => {}
 * utils.applyTo([fn1, fn2], 1) // both functions are called with 1
 */
export const applyTo = curry((fns, value) => fns.map(fn => fn(value)))

/**
 * Logs the value and returns it
 *
 * @example
 * tap(1) // console.logs: 1. returns 1
 */
export const tap = value => {
  console.log(value)
  return value
}

/**
 * Logs the value and returns it
 *
 * @example
 * tapWith('prefix', 1) // console.logs: prefix: 1. returns 1
 */
export const tapWith = curry((prefix, value) => {
  console.log(prefix, value)
  return value
})

export const mapAsync = curry((fn, items) =>
  items.reduce(
    (current, next) => current.then(() => fn(next)),
    Promise.resolve(),
  ),
)
