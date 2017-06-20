import isEmpty from 'lodash/fp/isEmpty';
import isEqual from 'lodash/fp/isEqual';

export default (store, ...mappers) => {
  const selectorMappers = Array.isArray(mappers[0]) ? mappers[0] : mappers;
  const onReducerInvoke = sMappers => () => {
    sMappers.forEach((sMapper) => {
      const preResult = sMapper.getPreResult();
      const nonPreResult = !preResult || isEmpty(preResult);
      const curResult = sMapper.selector(store.getState());
      if (nonPreResult && (!curResult || isEmpty(curResult))) {
        return;
      }
      if (nonPreResult || !isEqual(preResult, curResult)) {
        sMapper.handlers.forEach((handler) => {
          handler.call(null, preResult, curResult);
        });
      }
      sMapper.updateResult(curResult);
    });
  };
  store.subscribe(onReducerInvoke(selectorMappers));
};
