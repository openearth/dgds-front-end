import bootstrap from '../../../plugins/bootstrap'

describe('loadDatasets', () => {
  test('dispatches action to load themes when store is empty', () => {
    const dispatch = jest.fn()
    bootstrap({
      store: { state: { map: { themes: {} } }, dispatch },
    })

    expect(dispatch).toHaveBeenCalledWith('map/loadDatasets')
  })

  test('dont dispatch action when store is not empty', () => {
    const dispatch = jest.fn()
    bootstrap({
      store: { state: { map: { themes: { foo: 'bar' } } }, dispatch },
    })

    expect(dispatch).not.toHaveBeenCalled()
  })
})
