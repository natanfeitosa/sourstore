var sourstore = (function (exports, soursop) {
  'use strict';

  function defineStore(options) {
    let state = options.state();
    const subscribers = /* @__PURE__ */ new Set();
    const getters = options.getters;
    const actions = options.actions;
    const internals = {
      $subscribe(sub) {
        subscribers.add(sub);
        return () => subscribers.delete(sub);
      },
      $states: state
    };
    const store = new Proxy({}, {
      get(target, prop) {
        if (prop.startsWith("$")) {
          return internals[prop];
        }
        if (actions && prop in actions) {
          return actions[prop].bind(store);
        }
        if (getters && prop in getters) {
          return getters[prop].call(store, state);
        }
        return state[prop];
      },
      set(target, prop, value) {
        if (!(prop in state)) {
          return false;
        }
        state[prop] = value;
        subscribers.forEach((callback) => callback());
        subscribers.clear();
        return true;
      }
    });
    return () => {
      const updater = soursop.useState(null)[1];
      const removeSub = internals.$subscribe(() => updater(null));
      soursop.onUnmounted(removeSub);
      return store;
    };
  }

  exports.defineStore = defineStore;

  return exports;

})({}, soursop);
