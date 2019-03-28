export default function mapAsync(items) {
  return function map(fn) {
    return items.reduce((current, next) => {
      return current.then(() => fn(next))
    }, Promise.resolve())
  }
}
