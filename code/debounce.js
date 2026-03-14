const debounce = function (fn, delay) {
  let timer = null;
  return (...args) => {
    if (time) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
