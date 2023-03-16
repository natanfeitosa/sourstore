import { useState, onUnmounted } from 'soursop';

function defineStore(options) {
  const store = {};
  const subs = /* @__PURE__ */ new Set();
  const states = new Proxy(options.states, {
    set(obj, prop, value) {
      obj[prop] = value;
      subs.forEach((s) => s());
      subs.clear();
      return true;
    }
  });
  Object.defineProperties(
    store,
    Object.keys(states).reduce((acc, cur) => {
      acc[cur] = {
        set(v) {
          states[cur] = v;
        },
        get: () => states[cur]
      };
      return acc;
    }, {})
  );
  if (options.actions) {
    Object.entries(options.actions).forEach(([name, action]) => {
      Object.assign(store, { [name]: action.bind(store) });
    });
  }
  if (options.getters) {
    Object.entries(options.getters).forEach(([name, getter]) => {
      Object.defineProperty(store, name, {
        get: () => getter.call(store, states),
        set(a) {
          throw TypeError("you cannot assign values to this property, it is read-only");
        }
      });
    });
  }
  return () => {
    const updater = useState(null)[1];
    subs.add(updater);
    onUnmounted(() => subs.delete(updater));
    return store;
  };
}

export { defineStore };
