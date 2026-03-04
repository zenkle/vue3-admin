import { track, trigger } from "./ref";

const proxyMap = new WeakMap<object, any>();

const isObject = (val: any) => val !== null && typeof val === "object";

export function reactive<T extends object>(target: T): T {
  if (proxyMap.has(target)) {
    return proxyMap.get(target);
  }

  if (!isObject(target)) {
    return target;
  }

  const handler = {
    get(target: object, key: string, receiver: object) {
      track(target, key);
      const res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target: object, key: string, value: any, receiver: object) {
      const oldValue = Reflect.get(target, key, receiver);
      if (oldValue !== value) {
        const result = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return result;
      }
      return true;
    },
    deleteProperty(target: object, key: string) {
      const hadKey = Reflect.has(target, key);
      const result = Reflect.deleteProperty(target, key);
      if (hadKey && result) {
        trigger(target, key);
      }
      return result;
    },
  };
  const proxy = new Proxy(target, handler) as T;
  proxyMap.set(target, proxy);
  return proxy;
}
