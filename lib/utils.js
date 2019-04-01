import includes from 'lodash/includes'
import curry from 'lodash/curry'

export const includesIn = curry(includes, 2)
