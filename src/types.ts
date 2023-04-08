export type _StatesTree = Record<string | number | symbol, any>

export type _GettersTree<S extends _StatesTree> = Record<
  string,
  | ((state: S) => any)
  | (() => any)
>

export type _ActionsTree = Record<string, ((...args: any[]) => any)>

type GettersStore<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R
  ? R
  : G[k]
}

type ActionsStore<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never
}

export type SubsCallback<S> = (target: S, prop: keyof S, value: any) => void

export type Internals<S> = {
  $states: S
  $subscribe: (cb: SubsCallback<S>) => () => boolean
}

export type Store<
  S extends _StatesTree = {},
  G /* extends _GettersTree<S> */ = {},
  A /* extends _ActionsTree<S> */ = {}
> = S & GettersStore<G> & ActionsStore<A> & Internals<S>

export interface defineStoreArgs<S extends _StatesTree, G, A> {
  state: () => S
  getters?: G & ThisType<S & GettersStore<G>> & _GettersTree<S>
  actions?: A & ThisType<S & GettersStore<G>>
}

export type defineStoreReturn<
  S extends _StatesTree,
  G extends _GettersTree<S> = {},
  A extends _ActionsTree = {}
> = Internals<S> & (() => Store<S, G, A>)
