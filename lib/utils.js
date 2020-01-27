import includes from 'lodash/includes'
import get from 'lodash/get'
import curry from 'lodash/curry'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import matches from 'lodash/matches'
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
  moment(value).format(format)
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
  [property]: value
}))

/**
 * Executes the truthy function when the provided value is trythy.
 * Executes the falsy function when the provided value is falsy.
 * Both functions are provided with the value as the first argument
 *
 * @example
 * const pred = value => value
 * const truthy = () => {}
 * const falsy = () => {}
 * when(pred, truthy, falsy, 1) // truthy has been called
 * when(pred, truthy, falsy, 0) // falsy has been called
 */
export const when = curry((pred, truthy, falsy, value) =>
  pred(value) ? truthy(value) : falsy(value)
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
export const tap = (value) => {
  console.log(value) // eslint-disable-line
  return value
}

/**
 * Logs the value with a prefix and returns it
 *
 * @example
 * tapWith('prefix', 1) // console.logs: prefix: 1. returns 1
 */
export const tapWith = curry((prefix, value) => {
  console.log(prefix, value) // eslint-disable-line
  return value
})

/**
 * Maps over an array with an async function
 *
 * @example
 * mapAsync(fetch, ['first/url/', 'second/url']) // [<result of first/url>, <result of second/url>]
 */
export const mapAsync = curry((fn, items) => Promise.all(items.map(fn)))

/**
 * Filters a collection based on a provided object
 *
 * @example
 * const collection = [
 *   { 'a': 1, 'b': 2, 'c': 3 },
 *   { 'a': 4, 'b': 5, 'c': 6 }
 * ]
 * filterBy({ 'a': 4 }, collection) // { 'a': 4, 'b': 5, 'c': 6 }
 */
export const filterBy = curry((source, collection) =>
  filter(collection, matches(source))
)

/**
 * Clones an object and return it frozen
 *
 * @param {Object} object The object to freeze
 *
 * @example
 * const a = {b: 1}
 * freeze(a) // Returns a frozen clone of a
 */
export const freeze = object => Object.freeze(clone(object))

/**
 * Executes the then method with the provided callback on a promise
 *
 * @param {Function} callback The callback to execute once the promise resolves
 * @param {Promise} promise The promise to resolve
 *
 * @example
 * const promise = Promise.resolve('foo')
 * const log = console.log
 * then(log, promise) // "foo"
 */
export const then = curry((callback, promise) => promise.then(callback))
