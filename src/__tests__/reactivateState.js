import { createSelector } from 'reselect';
import configureStore, { increment, switchMeter } from '../__mocks__/store';
import { createSelectorMapper, reactivateState } from '../';


describe('reactivateState', () => {
  let store;
  const unitSelector = state => state.unitSwitcher;
  const counterSelector = state => state.counter;
  let expressionSelector;
  beforeEach(() => {
    store = configureStore({});
    expressionSelector = createSelector(unitSelector, counterSelector, (u, c) => `Totally ${c}${u ? u.unit : 'unknow'}`);
  });

  it('should automatically update mapper preState when state change', () => {
    const sMapper = createSelectorMapper(expressionSelector);
    reactivateState(store, sMapper);
    expect(sMapper.getPreResult()).toBeNull();
    store.dispatch(increment());
    expect(sMapper.getPreResult()).toBe('Totally 1unknow');
    store.dispatch(switchMeter());
    expect(sMapper.getPreResult()).toBe('Totally 1m');
  });

  it('should not call listener if mapper state unchange', () => {
    const listener = jest.fn();
    const unitObjSelector = createSelector(unitSelector, u => u);
    const sMapper = createSelectorMapper(unitObjSelector, listener);
    reactivateState(store, sMapper);

    store.dispatch(increment());
    expect(listener).toHaveBeenCalledTimes(0);
    store.dispatch(switchMeter());
    expect(listener).toHaveBeenCalledTimes(1);
    store.dispatch(switchMeter());
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should call listener if mapper state change', () => {
    const listener = jest.fn();
    const sMapper = createSelectorMapper(expressionSelector, listener);
    reactivateState(store, sMapper);

    store.dispatch(increment());
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(null, 'Totally 1unknow');

    store.dispatch(switchMeter());
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith('Totally 1unknow', 'Totally 1m');
  });

  it('should call multi listeners if mapper state change', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const sMapper1 = createSelectorMapper(expressionSelector, listener1);
    const sMapper2 = createSelectorMapper(expressionSelector, listener2);
    reactivateState(store, [sMapper1, sMapper2]);

    store.dispatch(increment());
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith(null, 'Totally 1unknow');

    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith(null, 'Totally 1unknow');
  });

  it('should array of maps as args', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const sMapper = createSelectorMapper(expressionSelector, [listener1, listener2]);
    reactivateState(store, sMapper);

    store.dispatch(increment());
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith(null, 'Totally 1unknow');

    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith(null, 'Totally 1unknow');
  });
});
