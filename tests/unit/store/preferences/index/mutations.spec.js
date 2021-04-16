import { mutations } from '@/store/preferences/index.js'

describe('setSidebarAnimating', () => {
  test('updates state.sidebarAnimating with boolean in payload', () => {
    const state = {
      sidebarAnimating: false
    }
    const expectedResult = true
    mutations.setSidebarAnimating(state, { animating: true })
    expect(state.sidebarAnimating).toBe(expectedResult)
  })
})

describe('setSidebarExpanded', () => {
  test('updates state.sidebarExpanded with boolean in payload', () => {
    const state = {
      sidebarExpanded: false
    }
    const expectedResult = true
    mutations.setSidebarExpanded(state, { expanded: true })
    expect(state.sidebarExpanded).toBe(expectedResult)
  })
})

describe('setUser', () => {
  test('updates state.user with object in payload', () => {
    const state = {
      user: null
    }
    const expectedResult = {
      email: 'email@email.com'
    }
    mutations.setUser(state, { user: { email: 'email@email.com' } })
    expect(state.user).toMatchObject(expectedResult)
  })
})
