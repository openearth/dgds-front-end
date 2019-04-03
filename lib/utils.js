import includes from 'lodash/includes'
import get from 'lodash/get'
import curry from 'lodash/curry'
import moment from 'moment'

export const includesIn = curry(includes, 2)

export const momentFormat = curry((format, value) =>
  moment(value).format(format),
)

export const getIn = curry(get, 2)

export const wrapInProperty = curry((property, value) => ({
  [property]: value,
}))

export const when = curry((truthy, falsy, value) =>
  value ? truthy(value) : falsy(value),
)
