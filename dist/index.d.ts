type _StatesTree = Record<string | number | symbol, any>;
type _GettersTree<S extends _StatesTree> = Record<string, ((state: S) => any) | (() => any)>;
type _ActionsTree = Record<string, ((...args: any[]) => any)>;
type GettersStore<G> = {
    readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : G[k];
};
type ActionsStore<A> = {
    [k in keyof A]: A[k] extends (...args: infer P) => infer R ? (...args: P) => R : never;
};
type Store<S extends _StatesTree = {}, G = {}, A = {}> = S & GettersStore<G> & ActionsStore<A> & {
    $states: S;
    $subscribe: () => () => boolean;
};
interface defineStoreArgs<S extends _StatesTree, G, A> {
    state: () => S;
    getters?: G & ThisType<S & GettersStore<G>> & _GettersTree<S>;
    actions?: A & ThisType<S & GettersStore<G>>;
}

declare function defineStore<S extends _StatesTree, G extends _GettersTree<S> = {}, A extends _ActionsTree = {}>(options: defineStoreArgs<S, G, A>): () => Store<S, G, A>;

export { defineStore };
