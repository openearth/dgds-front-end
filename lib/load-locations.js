import times from 'lodash/fp/times'
import pipe from 'lodash/fp/pipe'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import tail from 'lodash/fp/tail'
import identity from 'lodash/fp/identity'
import getFromApi from './request/get'
import { then } from './utils'

const plusOne = val => val + 1

const load = parameters => _page => {
  const page = _page > 1 ? { page: _page } : {}
  return getFromApi('locations', { ...parameters, ...page })
}

/**
 * Calls a callback with the results object from the locations endpoint
 *
 * @param {Object} parameters Parameters for the get request
 * @param {Function} callback The callback to be called with the results
 */
export default async function loadLocations(parameters, callback) {
  const loadPage = load(parameters)
  const { paging, results } = await loadPage(1)
  const { totalObjectCount } = paging
  const resultLength = results.length
  const totalRequests = Math.ceil(totalObjectCount / resultLength)
  const handleResponse = pipe([get('results'), callback])

  const loadMorePages = pipe([
    times(identity),
    map(plusOne),
    tail,
    map(loadPage),
    map(then(handleResponse)),
  ])

  const promises = [
    Promise.resolve(callback(results)),
    ...loadMorePages(totalRequests),
  ]

  return Promise.all(promises)
}
