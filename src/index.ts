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
  let state = options.state()
  const subscribers = new Set<() => void>()

  const getters = options.getters
  const actions = options.actions

  const internals = {
    $subscribe(sub: () => void) {
      subscribers.add(sub)
      return () => subscribers.delete(sub)
    },
    $states: state
  }

  const store = new Proxy({}, {
    get(target, prop: string) {
      if (prop.startsWith('$')) {
        return internals[prop as keyof typeof internals]
      }
      if (actions && prop in actions) {
        return actions[prop as keyof A].bind(store)
      }
      if (getters && prop in getters) {
        return getters[prop].call(store, state)
      }
      return state[prop as keyof S]
    },
    set(target, prop: string, value: any) {
      if(!(prop in state)) {
        return false
      }
      
      state[prop as keyof S] = value
      subscribers.forEach((callback) => callback())
      subscribers.clear()
      return true
    },
  }) as Store<S, G, A>

  return () => {
    const updater = useState(null)[1]
    const removeSub = internals.$subscribe(() => updater(null))
    onUnmounted(removeSub)
    return store
  }
}
