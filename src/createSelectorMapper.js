export default function createSelectorMapper(selector, ...rest) {
  const listeners = Array.isArray(rest[0]) ? rest[0] : rest;

  if (!listeners.every(dep => typeof dep === 'function')) {
    const dependencyTypes = listeners.map(
      dep => typeof dep,
    ).join(', ');
    throw new Error(
      'SelectorMapper expect all listener to be functions, ' +
      `instead received the following types: [${dependencyTypes}]`,
    );
  }

  let preResult = null;
  const selectorMapper = {
    selector,
    handlers: listeners,
  };
  selectorMapper.getPreResult = () => preResult;
  selectorMapper.updateResult = (curResult) => { preResult = curResult; };
  return selectorMapper;
}

