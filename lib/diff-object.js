export function diffArray (_alice, _bob) {
  const alice = [..._alice]
  const bob = [..._bob]
  const [mostItems, leastItems] =
    alice.length > bob.length
      ? [alice.length, bob.length]
      : [bob.length, alice.length]
  const longest = alice.length > bob.length ? alice : bob
  let returnValue = []
  for (let i = 0; i < leastItems; i++) {
    returnValue.push(diff(alice[i], bob[i]))
  }

  const remaining = mostItems > leastItems ? longest.slice(leastItems - 1) : []
  returnValue = returnValue.concat(remaining)

  const hasValues = returnValue.reduce((hasValue, value) => {
    return value ? !!value : hasValue
  }, false)
  return hasValues ? returnValue : undefined
}

export function diffObject (_alice, _bob) {
  const alice = { ..._alice }
  const bob = { ..._bob }

  const keysAlice = Object.keys(alice)
  const keysBob = Object.keys(bob)

  const keysUniqToAlice = keysAlice.filter(key => !keysBob.includes(key))
  const keysUniqToBob = keysBob.filter(key => !keysAlice.includes(key))
  const keysBoth = keysAlice.filter(key => keysBob.includes(key))

  const aliceUniq = keysUniqToAlice.reduce((obj, key) => {
    obj[key] = alice[key]
    return obj
  }, {})
  const bobUniq = keysUniqToBob.reduce((obj, key) => {
    obj[key] = bob[key]
    return obj
  }, {})

  const keysBothDiff = keysBoth.reduce((obj, key) => {
    const keyDiff = diff(alice[key], bob[key])
    if (keyDiff !== undefined) {
      obj[key] = keyDiff
    }
    return obj
  }, {})

  const result = { ...aliceUniq, ...bobUniq, ...keysBothDiff }
  return Object.keys(result).length ? result : undefined
}

export default function diff (_alice, _bob) {
  const typeAlice = Object.prototype.toString.call(_alice)
  const typeBob = Object.prototype.toString.call(_bob)

  if (typeAlice !== typeBob) {
    return _bob
  }

  if (typeAlice === '[object Array]') {
    return diffArray(_alice, _bob)
  }

  if (typeAlice === '[object Object]') {
    return diffObject(_alice, _bob)
  }

  return _alice !== _bob ? _bob : undefined
}
