// 创建全局变量，用来暂存当前正在执行的副作用函数
export interface RefEffect {
  (): void;
  scheduler?: () => void;
}

let activeEffect: RefEffect | null = null;
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
  const effectsToRun = new Set<RefEffect>();
  deps.forEach((eff) => effectsToRun.add(eff));
  effectsToRun.forEach((eff) => {
    if (eff.scheduler) {
      eff.scheduler();
    } else {
      eff();
    }
  });
}

export function effect(fn: () => void, options: { scheduler?: () => void }) {
  const runner = () => {
    const lastEffect = activeEffect;
    try {
      (runner as any).scheduler = options?.scheduler;
      activeEffect = runner as RefEffect;
      return fn();
    } finally {
      activeEffect = lastEffect;
    }
  };
  runner();
  return runner;
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
// 【新增】提供一个函数来设置 activeEffect
export function setActiveEffect(effect: RefEffect | null) {
  activeEffect = effect;
}

// 【可选】如果你需要在外部读取（比如 computed 需要判断是否为空），可以导出 getter
// 但通常 track 和 effect 都在内部，不需要导出 getter，除非 computed 需要显式判断
export function getActiveEffect() {
  return activeEffect;
}
export function ref<T>(value: T) {
  console.log("✍️ [User] 用户创建 ref 实例，初始值为:", value);
  return new RefImpl(value);
}
