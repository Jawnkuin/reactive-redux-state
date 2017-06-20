# reactive-redux-state

Make non-UI related redux state reactive.


## Motivation

Some framework for building desktop app like [Electron](https://electron.atom.io/) may have multi processes architecture, some processes are UI unrelavant. These processes are very different with Nodejs server processes, some features and operations are still handled within these processes, a event-driven model (like nodejs server) can barely handle, so redux is still a good solution even in a non-UI process. 

Taking electron as example, if Redux is needed in main process there are some points to be considered.

- The whole app is still driven by actions.
- Without UI, actions can only originate from renderer processes or network/IO events. Putting operation handling and feature updating functions in action creators is improper. 
- Redux state is read-only, reducers are pure functions which should do nothing other than generating new state.
- Subscribe a listener to Redux state can be a solution, but not all action dispatching will invoke listener, only a specific sub state tree changing can fire a relavant listener.

The main idea of this module is using [reselect](https://github.com/reactjs/reselect) to memoize the preview sub state or some data derived from state, when state changes, corresponding listeners will be called.

## Usage

**Install**

```shell
npm install --save reactive-redux-state
```

**Create selector mapper**

Use [reselect](https://github.com/reactjs/reselect) create a `selector`.

```javascript
import { createSelector } from 'reselect'

const unitSelector = state => state.unitSwitcher;
const counterSelector = state => state.counter;

const expressionSelector = createSelector(
  unitSelector, 
  counterSelector, 
  (u, c) => `Totally ${c}${u}`
);

```

For further `reselect` usage, check [`reselect document`](https://github.com/reactjs/reselect/blob/master/README.md).

**Map listeners to selector**

```javascript
...
import { createSelectorMapper } from 'reactive-redux-state'

const listenerA = (preState,nextState) => {
  console.log(`A got pre:${preState} & next:${nextState}`);
}

const listenerB = (preState,nextState) => {
  console.log(`B got pre:${preState} & next:${nextState}`);
}

...

const mapper = createSelectorMapper(expressionSelector,listenerA,listenerB);
// OR:
// const mapper = createSelectorMapper(expressionSelector,[listenerA,listenerB]);

```

If you want dispatch another action inside the listener, be sure using **asynchronous functions**, otherwise endless loop will be encountered.

```javascript
const listenerA = (preState,nextState) => {
  setImmediate(()=>{
    store.dispatch(increment())
  })
}
```

**Reativate state**



```javascript
...
import { reactivateState } from 'reactive-redux-state';

...

reactivateState(store,mapper)
// bind multi mappers: 
// reactivateState(store,mapper1,mapper2);
// Or
// reactivateState(store,[mapper1,mapper2]);

```

## License
MIT



