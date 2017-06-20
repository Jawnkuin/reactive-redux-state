import { createSelector } from 'reselect';
import configureStore, { increment, switchMeter } from '../__mocks__/store';
import { createSelectorMapper } from '../';


describe('createSelectorMapper', () => {
  let store;
  const unitSelector = state => state.unitSwitcher;
  const counterSelector = state => state.counter;
  let expressionSelector;
  beforeEach(() => {
    store = configureStore({});
    expressionSelector = createSelector(unitSelector, counterSelector, (u, c) => `Totally ${c}${u}`);
  });
  it('should recieve one selector & one or multi functions as input', () => {
    const listener1 = jest.fn();
    let sMapper = createSelectorMapper(expressionSelector, listener1);
    expect(sMapper.handlers).toBeInstanceOf(Array);
    expect(sMapper.handlers.length).toBe(1);

    sMapper = createSelectorMapper(expressionSelector);
    expect(sMapper.handlers.length).toBe(0);

    const listener2 = jest.fn();
    sMapper = createSelectorMapper(expressionSelector, listener1, listener2);
    expect(sMapper.handlers.length).toBe(2);

    sMapper = createSelectorMapper(expressionSelector, [listener1, listener2]);
    expect(sMapper.handlers.length).toBe(2);

    const listener3 = 'notAFunction';
    expect(() => {
      sMapper = createSelectorMapper(expressionSelector, [listener1, listener2, listener3]);
    }).toThrow();
  });

  it('should update preResult by providing funcs', () => {
    store.dispatch(increment());
    store.dispatch(switchMeter());
    const sMapper = createSelectorMapper(expressionSelector);
    expect(sMapper.getPreResult()).toBeNull();
    const newState = sMapper.selector(store.getState());
    sMapper.updateResult(newState);
    expect(sMapper.getPreResult()).toBe(newState);
  });
});
