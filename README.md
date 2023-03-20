# sourstore

<p align="center">A lightweight state management library for Soursop</p>
<div align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/sourstore">
  <img alt="npm" src="https://img.shields.io/npm/dm/sourstore">
  <img alt="NPM" src="https://img.shields.io/npm/l/sourstore">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/sourstore">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/natanfeitosa/sourstore">
  <img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/sourstore">
</div>


## Instalation

### Local

Via NPM:
```bash
npm i sourstore
```
Via Yarn:
```bash
yarn add sourstore
```

### CDN

NPM version
```html
<script src="https://cdn.jsdelivr.net/npm/sourstore"></script>
```

GitHub (dev) version
```html
<script src="https://cdn.jsdelivr.net/gh/natanfeitosa/sourstore@HEAD/dist/sourstore.iife.js"></script>
```

## Quickstart

You can create a small app using **babel cdn**

```html
<div id="app"></div>
<!-- Load Soursop -->
<script src="https://cdn.jsdelivr.net/npm/soursop"></script>
<Script src="https://cdn.jsdelivr.net/npm/sourstore"></script>
<!-- Load Babel -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
//@jsx soursop.createElement
//@jsxFrag soursop.Fragment

const useCounter = sourstore.defineStore({
  state: () => ({ count: 0 }),
  getters: {
    double(states) {
      return states.count * 2
    },
    triple() {
      return this.count * 3
    },
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

function Counter() {
  const counter = useCounter()
  return (
    <>
      <h1>Counter {counter.count}</h1>
      <h3>Double: {counter.double}</h3>
      <h3>Triple: {counter.triple}</h3>
      <button onClick={counter.increment}>Click here</button>
    </>
  )
}

const container = document.querySelector('#app')
soursop.render(<Counter/>, container)
</script>
```
