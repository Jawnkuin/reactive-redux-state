import { createStore, combineReducers } from 'redux';

// actions
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

const SWITCH_METER = 'SWITCH_METER';
const SWITCH_KILO_METER = 'SWITCH_KILO_METER';

const SET_NULL = 'SET_NULL';

export function setNUll() {
  return {
    type: SET_NULL,
  };
}


export function increment() {
  return {
    type: INCREMENT_COUNTER,
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER,
  };
}

export function switchMeter() {
  return {
    type: SWITCH_METER,
  };
}

export function switchKilometer() {
  return {
    type: SWITCH_KILO_METER,
  };
}

// reducer
function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    default:
      return state;
  }
}

function unitSwitcher(state = null, action) {
  switch (action.type) {
    case SWITCH_KILO_METER:
      return { unit: 'km' };
    case SWITCH_METER:
      return { unit: 'm' };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  counter,
  unitSwitcher,
});

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
  );
  return store;
}

