export default function mapAsync(fn) {
  return function map(items) {
    return items.reduce((current, next) => {
      return current.then(() => fn(next))
    }, Promise.resolve())
  }
}
