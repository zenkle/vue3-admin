/**
 * Vue3 响应式原理核心实现
 * 基于 Proxy + WeakMap + Map + Set
 */

// 1. 使用 WeakMap 存储每个对象的所有依赖
// targetMap的结构: WeakMap {
//   target => Map {
//     key => Set [effect1, effect2, ...]
//   }
// }
const targetMap = new WeakMap()

// 当前正在执行的 effect
let activeEffect = null
// effect 执行栈（处理嵌套 effect）
const effectStack = []

/**
 * 2. track - 依赖收集
 * 当读取属性时，记录当前 effect 依赖于这个属性
 */
function track(target, key) {
    if (!activeEffect) return

    // 获取目标对象的依赖映射
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    // 获取具体属性的依赖集合
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    // 将当前 effect 添加到依赖集合中
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
        // 反向依赖，用于 cleanup
        activeEffect.deps.push(dep)
    }
}

/**
 * 3. trigger - 触发更新
 * 当设置属性时，执行所有依赖这个属性的 effect
 */
function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const dep = depsMap.get(key)
    if (!dep) return

    // 执行所有 effect
    const effectsToRun = new Set(dep)
    effectsToRun.forEach(effectFn => {
        // 避免无限循环（如果在 effect 中修改了依赖的属性）
        if (effectFn !== activeEffect) {
            if (effectFn.options && effectFn.options.scheduler) {
                effectFn.options.scheduler(effectFn)
            } else {
                effectFn()
            }
        }
    })
}

/**
 * 4. reactive - 创建响应式对象
 * 使用 Proxy 拦截对象的操作
 */
function reactive(target) {
    // 如果不是对象，直接返回
    if (typeof target !== 'object' || target === null) {
        return target
    }

    // 如果已经是响应式对象，直接返回
    if (target.__is_reactive) {
        return target
    }

    // 数组需要特殊处理
    const isArray = Array.isArray(target)

    const handler = {
        get(target, key, receiver) {
            // 收集依赖
            track(target, key)

            const result = Reflect.get(target, key, receiver)

            // 深层响应式：如果返回值是对象，继续包装
            if (typeof result === 'object' && result !== null) {
                return reactive(result)
            }

            return result
        },

        set(target, key, value, receiver) {
            const oldValue = target[key]
            const result = Reflect.set(target, key, value, receiver)

            // 对于数组，key 可能是索引
            // 只有值真正改变时才触发更新
            if (oldValue !== value) {
                trigger(target, key)
                // 数组长度变化时也要触发 length
                if (isArray && (key === 'length' || typeof key === 'number')) {
                    trigger(target, 'length')
                }
            }

            return result
        },

        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key)
            if (result) {
                trigger(target, key)
            }
            return result
        }
    }

    const proxy = new Proxy(target, handler)
    proxy.__is_reactive = true
    return proxy
}

/**
 * 5. effect - 副作用函数
 * 立即执行函数，并自动追踪依赖
 */
function effect(fn, options = {}) {
    const effectFn = () => {
        try {
            // 清理旧的依赖关系
            cleanup(effectFn)

            // 设置为当前 active effect
            activeEffect = effectFn
            effectStack.push(effectFn)

            // 执行函数，触发 getter，收集依赖
            return fn()
        } finally {
            effectStack.pop()
            activeEffect = effectStack[effectStack.length - 1]
        }
    }

    effectFn.deps = [] // 存储所有依赖这个 effect 的 dep 集合
    effectFn.options = options

    // 立即执行一次
    effectFn()

    // 返回 effectFn，便于外部调用
    return effectFn
}

/**
 * 清理 effect 的所有依赖
 */
function cleanup(effectFn) {
    const deps = effectFn.deps
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effectFn)
        }
        deps.length = 0
    }
}

/**
 * 6. computed - 计算属性
 * 基于响应式数据的派生值，有缓存
 */
function computed(getter) {
    let value
    let dirty = true // 是否需要重新计算

    const computedObj = {}

    // 创建 lazy effect，不立即执行
    const effectFn = () => {
        try {
            // 清理旧的依赖关系
            cleanup(effectFn)

            // 设置为当前 active effect
            activeEffect = effectFn
            effectStack.push(effectFn)

            // 执行 getter
            value = getter()
            dirty = false
        } finally {
            effectStack.pop()
            activeEffect = effectStack[effectStack.length - 1]
        }
    }

    effectFn.deps = []
    effectFn.options = {
        scheduler: () => {
            // 当依赖变化时，标记为 dirty
            dirty = true
            // 触发 computed 对象的依赖更新
            trigger(computedObj, 'value')
        }
    }

    // 使用 Object.defineProperty 定义 getter
    Object.defineProperty(computedObj, 'value', {
        get() {
            // 收集依赖
            track(computedObj, 'value')

            // 如果需要重新计算
            if (dirty) {
                effectFn()
            }

            return value
        },
        enumerable: true,
        configurable: true
    })

    return computedObj
}

/**
 * 7. ref - 基本类型响应式
 * 将基本类型包装成对象
 */
function ref(value) {
    const refObj = {}

    Object.defineProperty(refObj, 'value', {
        get() {
            track(refObj, 'value')
            return value
        },
        set(newValue) {
            value = newValue
            trigger(refObj, 'value')
        },
        enumerable: true,
        configurable: true
    })

    return refObj
}

// 导出供使用
window.reactive = reactive
window.effect = effect
window.computed = computed
window.ref = ref
window.track = track
window.trigger = trigger
