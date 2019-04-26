import times from 'lodash/fp/times'
import pipe from 'lodash/fp/pipe'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import flatten from 'lodash/fp/flatten'
import identity from 'lodash/fp/identity'
import getFromApi from './request/get'

const delay = ms => new Promise(resolve => setTimeout(_ => resolve(), ms))
const plus = a => b => a + b
const plusOne = plus(1)

const load = parameters => _page => {
  const page = _page > 1 ? { page: _page } : {}
  return getFromApi('locations', { ...parameters, ...page })
}

// prettier-ignore
const batch = size => arr =>
  arr.reduce((list, item, index) => {
    const listLastIndex = Math.max(list.length - 1, 0)

    index % size
      ? list[listLastIndex].push(item)
      : list.push([item])

    return list
  }, [])

/**
 * Calls a callback with the results object from the locations endpoint
 *
 * @param {Object} parameters Parameters for the get request
 * @param {Function} callback The callback to be called with the results
 */
export default async function loadLocations(parameters, callback) {
  const loadPage = load(parameters)
  const firstPageResponse = await loadPage(1)
  const { paging, results } = firstPageResponse
  const { totalObjectCount } = paging
  const resultLength = results.length
  const totalPages = Math.ceil(totalObjectCount / resultLength)
  const totalAdditionalPages = totalPages - 1
  const handleResponse = pipe([get('results'), callback])

  const loadAdditionalPages = ({
    offset,
    batchSize,
    totalPages,
    callback,
    delayPerBatch,
  }) =>
    pipe([
      times(identity),
      map(plusOne),
      map(plus(offset)),
      batch(batchSize),
      map(arr => fn => Promise.all(arr.map(fn))),
      loadBatchesSequential({ callback, delayPerBatch }),
    ])(totalPages)

  const loadBatchesSequential = ({ callback, delayPerBatch }) => batches => {
    return new Promise(async (resolve, reject) => {
      let results = []
      for (const batch of batches) {
        await delay(delayPerBatch)
        const responses = await batch(loadPage)
        results = [...results, ...responses.map(callback)]
      }
      resolve(results)
    })
  }

  const promises = [
    Promise.resolve([handleResponse(firstPageResponse)]),
    loadAdditionalPages({
      callback: handleResponse,
      offset: 1,
      batchSize: 10,
      delayPerBatch: 500,
      totalPages: totalAdditionalPages,
    }),
  ]

  return Promise.all(promises).then(flatten)
}
