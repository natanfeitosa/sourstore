import { useState, onUnmounted } from 'soursop'
import {
  _StatesTree,
  _GettersTree,
  _ActionsTree,
  defineStoreArgs,
  Store
} from './types'

export function defineStore<
  S extends _StatesTree,
  G extends _GettersTree<S> = {},
  A extends _ActionsTree = {}
>(options: defineStoreArgs<S, G, A>) {
  const store = {} as Store<S, G, A>
  const subs: Set<Function> = new Set()

  const states = new Proxy(options.states, {
    set(obj, prop, value) {
      //@ts-ignore
      obj[prop] = value
      subs.forEach(s => s())
      subs.clear()
      return true
    }
  })

  Object.defineProperties(
    store,
    Object.keys(states).reduce((acc, cur) => {
      //@ts-ignore
      acc[cur] = {
        set(v: unknown) {
          //@ts-ignore
          states[cur] = v
        },
        get: () => states[cur]
      }

      return acc
    }, {})
  )

  if(options.actions) {
    Object.entries(options.actions).forEach(([name, action]) => {
      Object.assign(store, { [name]: action.bind(store) })
    })
  }

  if (options.getters) {
    Object.entries(options.getters).forEach(([name, getter]) => {
      Object.defineProperty(store, name, {
        get: () => getter.call(store, states),
        set(a) {
          throw TypeError('you cannot assign values to this property, it is read-only')
        }
      })
    })
  }

  return () => {
    const updater = useState(null)[1]
    subs.add(updater)
    onUnmounted(() => subs.delete(updater))
    return store
  }
}
