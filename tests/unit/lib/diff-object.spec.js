import diff from '@/lib/diff-object'

describe('diff', () => {
  test('returns undefined on same objects', () => {
    const a = { one: '1', two: '2' }
    const b = { one: '1', two: '2' }
    const result = undefined
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in object', () => {
    const a = { one: '1', two: '2', three: '3' }
    const b = { one: '1', two: 'two', three: '3' }
    const result = { two: 'two' }
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in nested object', () => {
    const a = { one: { two: '2', three: { four: '4' } } }
    const b = { one: { two: '2', three: { four: 'four' } } }
    const result = { one: { three: { four: 'four' } } }
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in type mismatches', () => {
    const a = { one: '1', two: '2' }
    const b = { one: '1', two: 2 }
    const result = { two: 2 }
    expect(diff(a, b)).toEqual(result)
  })

  test('returns undefined on same arrays', () => {
    const a = [1, 2, 3, 4]
    const b = [1, 2, 3, 4]
    const result = undefined
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in arrays', () => {
    const a = [1, 2, 3, 4]
    const b = [1, 2, 3, 5]
    const result = [undefined, undefined, undefined, 5]
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in objects in arrays', () => {
    const a = [{ one: '1', two: 'two' }]
    const b = [{ one: '1', two: '2' }]
    const result = [{ two: '2' }]
    expect(diff(a, b)).toEqual(result)
  })

  test('find differences in non objects or arrays', () => {
    const a = 'one'
    const b = 'two'
    const result = 'two'
    expect(diff(a, b)).toEqual(result)
  })

  test('keep properties uniqe to objects', () => {
    const a = { one: 'one', two: 'two' }
    const b = { two: 'two', three: 'three' }
    const result = { one: 'one', three: 'three' }
    expect(diff(a, b)).toEqual(result)
  })

  test('keep uniqe items in array', () => {
    const a = [1, 2, 3, 4]
    const b = [1, 2, 3]
    const result = [undefined, undefined, undefined, 3, 4]
    expect(diff(a, b)).toEqual(result)
  })
})
