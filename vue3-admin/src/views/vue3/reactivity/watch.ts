import { effect } from "./ref";
export type WatchSource<T = any> = (() => T) | { value: T };
export type WatchCallback<T = any> = (newVal: T, oldVal: T | undefined) => void;
export interface WatchOptions {
  immediate?: boolean;
  flush?: "sync" | "post";
}

function getValue(source: WatchSource) {
  if (source instanceof Function) {
    return source();
  } else if ("value" in source) {
    return source.value;
  } else {
    throw new Error("Invalid watch source");
  }
}
export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: WatchOptions = {},
) {
  const { immediate = false, flush = "post" } = options;
  let oldValue: T | undefined = undefined;
  let isFirstRun = true;

  const effectFn = () => {
    const newVal = getValue(source);

    if (isFirstRun) {
      if (immediate) {
        callback(newVal, undefined);
      }
      oldValue = newVal;
      isFirstRun = false;
    } else {
      callback(newVal, oldValue);
      oldValue = newVal;
    }
  };

  const runner = effect(effectFn, {
    scheduler: () => {
      if (flush === "sync") {
        effectFn();
      } else {
        Promise.resolve().then(effectFn);
      }
    },
  });

  runner.run();
  return () => {
    // 取消订阅
    runner?.stop();
  }
}
