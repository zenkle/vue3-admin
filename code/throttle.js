// 以最后一次点击为准，最后一次点击后再执行
function throttle(fn, delay) {
  let prev = 0;
  return (...args) => {
    let now = Date.now();
    if (now - prev > delay) {
      fn.apply(this, args);
      prev = now;
    }
  };
}
