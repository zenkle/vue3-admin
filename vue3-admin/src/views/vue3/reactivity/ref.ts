// 创建全局变量，用来暂存当前正在执行的副作用函数
let activeEffect: (() => void) | null = null;
const isObject = (val: any): val is object =>
  val !== null && typeof val === "object";

const targetMap = new WeakMap<object, Map<any, Set<() => void>>>();
export function track(target: object, key: string | symbol) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  deps.forEach((effect) => effect());
}

export function effect(fn: () => void) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

function createReactiveObject(target: any) {
  if (!isObject(target)) {
    return target;
  }

  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key);
      const res = Reflect.get(target, key, receiver);
      return isObject(res) ? createReactiveObject(res) : res;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      if (oldValue !== value) {
        Reflect.set(target, key, value, receiver);
        trigger(target, key); // 触发更新
        return true;
      }
      return true;
    },
  });
}

class RefImpl<T> {
  private _value: T;

  constructor(value: T) {
    this._value = isObject(value) ? createReactiveObject(value) : value;
  }

  get value() {
    track(this, "value");

    return this._value;
  }
  set value(newValue: T) {
    this._value = isObject(newValue)
      ? createReactiveObject(newValue)
      : newValue;
    trigger(this, "value");
  }
}

export function ref<T>(value: T) {
    console.log('✍️ [User] 用户创建 ref 实例，初始值为:', value);
  return new RefImpl(value);
}
