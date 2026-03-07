/**
 * 定义store，接受一个id和包含state，getters，actions的对象
 * state数据响应式处理：使用reactive将state转换为响应式对象
 * getters:使用computed将getters转换为响应式对象
 * actions:将actions转换为普通函数，绑定到store实例上
 * 插件系统：预留_p存储插件
 */
/**
 * import { createPinia } from 'pinia'
  pinia=createMiniPinia()
  app.use(pinia)

  export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
  })
 */
import { reactive, computed, toRefs, type App } from "vue";
// 定义 Store 的配置类型
export interface DefineStoreOptions<Id extends string, S, G, A> {
  id: Id;
  state?: () => S;
  getters?: G & ThisType<{ state: S } & G & A>; // ThisType 用于推导 this 的类型
  actions?: A & ThisType<{ state: S } & G & A>;
}
// 将 getter 函数映射为其返回值类型
type UnwrapGetters<G> = {
  [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never
}
// 定义 Store 实例的类型
export interface Store<Id extends string, S, G, A> {
  id: Id;
  state: S;
  getters: { [K in keyof G]: K extends string ? UnwrapGetters<G>[K] : never }; // Getters 应该是计算后的值
  actions: A;
  // 为了方便解构，通常会将 state 的属性也混入到 store 根对象下
  [key: string]: any;
}

// 插件类型
type PiniaPlugin = (context: {
  store: Store<any, any, any, any>;
  app: any; // 简化处理，实际应为 App 实例
}) => void;

class MiniPinia {
  private stores: Map<string, Store<any, any, any, any>> = new Map();
  private plugins: PiniaPlugin[] = [];
  private _app: App | null = null;

  install(app: any) {
    this._app = app;
    app.config.globalProperties.$pinia = this;
    app.provide("miniPinia", this);
  }

  use(plugin: PiniaPlugin) {
    this.plugins.push(plugin);

    return this;
  }

  defineStore<Id extends string, S, G, A>(
    options: DefineStoreOptions<Id, S, G, A>,
  ) {
    const { id, state, getters, actions } = options;

    const setupStore = (): Store<Id, S, G, A> => {
      if (this.stores.has(id)) {
        return this.stores.get(id) as Store<Id, S, G, A>;
      }

      const rawState = state?.() || {};
      const reactiveState = reactive(rawState);

      const storeInstance = {} as Store<Id, S, G, A>;
      storeInstance.id = id;
      storeInstance.state = reactiveState as S;

      const storeGetters: any = {};
      if (getters) {
        Object.keys(getters).forEach((getter) => {
          const getterFn = (getters as any)[getter];
          const c = computed(() =>
            (getterFn as any).call(storeInstance, reactiveState),
          );
          Object.defineProperty(storeInstance, getter, {
            get: () => c.value,
            enumerable: true,
          });
        });
      }

      const storeActions: any = {};
      if (actions) {
        Object.keys(actions).forEach((action) => {
          const actionFn = (actions as any)[action];
          storeActions[action] = actionFn.bind(storeInstance);
        });
      }

      Object.assign(storeInstance, {
        ...storeGetters,
        ...storeActions,
      });
      const stateRefs = toRefs(reactiveState);
      for (const key in stateRefs) {
        Object.defineProperty(storeInstance, key, {
          get: () => (reactiveState as any)[key],
          set: (v: any) => ((reactiveState as any)[key] = v),
          enumerable: true,
          configurable: true,
        });
      }
      if (this._app) {
        this.plugins.forEach((plugin) => {
          plugin({ store: storeInstance, app: this._app });
        });
      }

      this.stores.set(id, storeInstance);
      return storeInstance;
    };

    return setupStore;
  }
}

export function createMiniPinia() {
  return new MiniPinia();
}
