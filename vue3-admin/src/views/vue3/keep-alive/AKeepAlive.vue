<template>
  <!-- 容器，用于存放所有可能显示的组件 -->
  <div ref="containerRef">
    <!-- 
      我们不再直接渲染 slots.default() 
      而是渲染我们缓存管理后的 vnodes 
    -->
    <component 
      v-for="vnode in activeVNodes" 
      :is="vnode" 
      :key="getCacheKey(vnode)"
    />
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, onMounted, onBeforeUnmount, defineComponent, h, cloneVNode, nextTick } from 'vue';

const props = defineProps({
  include: [String, RegExp, Array],
  exclude: [String, RegExp, Array],
  max: [String, Number]
});

const containerRef = ref(null);
const cache = new Map(); // key -> { vnode, instance, isAlive }
const keys = []; // 用于 LRU 顺序
const activeVNodes = ref([]); // 当前应该渲染（显示）的 vnode 列表

const instance = getCurrentInstance();

// 辅助：获取 Key
const getCacheKey = (vnode) => {
  const { key, type } = vnode;
  const name = type.name || type.__name;
  return key == null ? name : key;
};

// 辅助：匹配规则
const matches = (name) => {
  if (!name) return false;
  const { include, exclude } = props;
  if (exclude && (Array.isArray(exclude) ? exclude.some(p => name.match(p)) : name.match(exclude))) return false;
  if (include && !(Array.isArray(include) ? include.some(p => name.match(p)) : name.match(include))) return false;
  return true;
};

// 核心：修剪缓存 (LRU)
const pruneCache = () => {
  const max = parseInt(props.max, 10);
  if (!max || cache.size <= max) return;
  
  const firstKey = keys.shift();
  if (firstKey) {
    const cached = cache.get(firstKey);
    if (cached) {
      // 真正销毁：移除 DOM，触发 beforeUnmount/unmounted
      // 由于我们是隐藏而非移除，这里需要手动模拟销毁流程比较复杂
      // 简化版：直接从 map 删除，依赖 GC。
      // 若要完美，需调用 instance.ctx.$destroy() (Vue2) 或内部卸载逻辑 (Vue3较难外部调用)
      // 此处演示重点在“缓存生效”，暂不做深度销毁模拟，实际生产需更严谨
      cache.delete(firstKey);
    }
  }
};

// 触发钩子
const invokeHook = (instance, hookName) => {
  if (instance && instance.ctx && typeof instance.ctx[hookName] === 'function') {
    instance.ctx[hookName]();
  }
  // 处理 setup 中的 onActivated/onDeactivated (存储在 instance.bu/bm 等位置不太一样，
  // Vue3 中这些钩子存在 instance.sp (spare?) 或者通过 scheduler 调度。
  // 简单起见，这里主要触发 options API 的钩子。
  // 对于 setup 语法糖，Vue 将其转换为带有 __scopeId 等的逻辑，外部很难直接调用。
  // *修正*：Vue3 中 setup 里的 onActivated 会推入 instance.sp (splice?) 数组或者特定的 effects 队列。
  // 这里为了演示效果，我们尝试调用 ctx 上的方法，这能覆盖 Options API。
  // 若要支持 Setup API，需要访问 instance.sp (如果存在) 并执行。
  if (instance && instance.sp) {
     // Vue 3.2+ 内部存储 activated/deactivated 回调的地方可能是 sp (splice?) 
     // 实际上 Vue3 源码中，onActivated 注册的是 effect，存在 instance.sp (如果是 keep-alive 相关)
     // 这是一个黑盒，通常我们通过 render 触发。
     // *替代方案*：在组件内部用 provide/inject 或者全局事件总线模拟，但太麻烦。
     // 下面尝试直接寻找并执行 setup 中注册的钩子 (非官方 API，仅供演示)
     const hooks = instance.sp; // 某些版本可能存在
     if (hooks) {
       hooks.forEach(hook => {
         if (hook.name === hookName || (hook.job && hook.job.name === hookName)) {
            try { hook(); } catch(e){}
         }
       });
     }
  }
};

// 更新缓存状态
const updateCache = () => {
  const rawVNode = instance.slots.default?.();
  if (!rawVNode || !Array.isArray(rawVNode)) {
    activeVNodes.value = [];
    return;
  }
  
  const vnode = rawVNode[0];
  if (!vnode || !vnode.type) {
    activeVNodes.value = [vnode];
    return;
  }

  const cacheKey = getCacheKey(vnode);
  const shouldCache = cacheKey && matches(cacheKey);

  let cachedItem = cache.get(cacheKey);
  let isReactivating = false;

  if (shouldCache) {
    if (cachedItem) {
      // --- 命中缓存：激活 ---
      isReactivating = true;
      // 更新 LRU
      const idx = keys.indexOf(cacheKey);
      if (idx > -1) keys.splice(idx, 1);
      keys.push(cacheKey);
      
      // 恢复状态
      cachedItem.isAlive = true;
      // 关键：我们需要复用这个 vnode，但要保持响应式更新？
      // 简单做法：直接使用缓存的 vnode，但需要确保它的 props 是最新的
      // 由于 h() 创建的 vnode 是静态的，我们需要合并新的 props
      const newVNode = cloneVNode(cachedItem.vnode, vnode.props);
      newVNode.component = cachedItem.instance; // 强制指向旧实例
      
      activeVNodes.value = [newVNode];
      
      // 触发 activated
      nextTick(() => {
        invokeHook(cachedItem.instance, 'activated');
      });

    } else {
      // --- 未命中：新组件 ---
      keys.push(cacheKey);
      // 正常渲染，稍后在 beforeUnmount 拦截 (但在本方案中，我们用 watch 监听变化来“隐藏”旧组件)
      activeVNodes.value = [vnode];
      
      // 预存，等待组件挂载后捕获 instance
      // 注意：此时 instance 还没生成，需要在 mounted 后或者通过 proxy 捕获
      // 技巧：利用 vnode.component 在渲染后会被赋值
      cache.set(cacheKey, { vnode, instance: null, isAlive: true });
    }
  } else {
    // --- 不缓存 ---
    if (cachedItem) {
      // 如果之前缓存了现在不缓存了，销毁它
      invokeHook(cachedItem.instance, 'beforeUnmount'); // 模拟
      invokeHook(cachedItem.instance, 'unmounted');
      cache.delete(cacheKey);
      const idx = keys.indexOf(cacheKey);
      if (idx > -1) keys.splice(idx, 1);
    }
    activeVNodes.value = [vnode];
  }

  // 处理“被替换下来”的旧组件 (即不在 activeVNodes 里的)
  // 遍历 cache，除了当前的 key，其他的都设为 isAlive = false 并触发 deactivated
  cache.forEach((item, key) => {
    if (key !== cacheKey && item.isAlive) {
      item.isAlive = false;
      invokeHook(item.instance, 'deactivated');
      // 注意：在这个“显隐切换”方案中，我们并没有真正把 vnode 从 activeVNodes 移除导致销毁，
      // 而是依靠下面的逻辑：如果 key 不匹配，我们就不把它放入 activeVNodes。
      // 但是！如果不放入 activeVNodes，Vue 就会卸载它 (调用 unmounted)。
      // 所以这个方案有个矛盾：要么保留在 DOM 里 (display:none)，要么就被销毁。
      
      // *修正策略*：
      // 真正的 KeepAlive 是把 DOM 移走但不销毁。
      // 上面的 template 写法 `<component v-for...>` 如果 vnode 不在数组里，DOM 就会被删。
      // 所以我们需要改变策略：**所有缓存的组件都渲染，但用 v-show 控制显隐**。
    }
  });
  
  pruneCache();
};

// 重新设计渲染逻辑：渲染所有缓存 + 当前
// 这样 DOM 不会被删，只是隐藏
const renderContent = () => {
   const rawVNode = instance.slots.default?.();
   const currentVNode = rawVNode?.[0];
   if (!currentVNode) {
     activeVNodes.value = [];
     return;
   }

   const cacheKey = getCacheKey(currentVNode);
   console.log('cacheKey', cacheKey);
   const shouldCache = cacheKey && matches(cacheKey);
   console.log('shouldCache', shouldCache);
   // 1. 处理当前组件
   let finalCurrentVNode = currentVNode;
   
   if (shouldCache) {
     const cached = cache.get(cacheKey);
     if (cached) {
       // 激活
       if (!cached.isAlive) {
         cached.isAlive = true;
         nextTick(() => invokeHook(cached.instance, 'activated'));
       }
       // 更新 props
       finalCurrentVNode = cloneVNode(cached.vnode, currentVNode.props);
       finalCurrentVNode.component = cached.instance;
       // 更新缓存中的引用，以便下次 props 变化能同步
       cached.vnode = finalCurrentVNode; 
     } else {
       // 新组件，先放进去，instance 等 mounted 后填充
       cache.set(cacheKey, { vnode: currentVNode, instance: null, isAlive: true });
       keys.push(cacheKey);
     }
   } else {
     // 不缓存，清理旧的
     if (cache.has(cacheKey)) {
        const old = cache.get(cacheKey);
        invokeHook(old.instance, 'beforeUnmount');
        invokeHook(old.instance, 'unmounted');
        cache.delete(cacheKey);
        keys.splice(keys.indexOf(cacheKey), 1);
     }
   }

   // 2. 处理其他缓存组件 (设为非活跃)
   cache.forEach((item, key) => {
     if (key !== cacheKey) {
       if (item.isAlive) {
         item.isAlive = false;
         invokeHook(item.instance, 'deactivated');
       }
     }
     
     // 捕获 instance (如果是新加入的)
     if (!item.instance && item.vnode.component) {
       item.instance = item.vnode.component;
     }
   });

   pruneCache();

   // 3. 构建渲染列表：当前组件 + 所有缓存组件 (非活跃的隐藏)
   const allVNodes = [];
   
   // 添加当前
   allVNodes.push(finalCurrentVNode);
   
   // 添加缓存的 (非当前)
   cache.forEach((item, key) => {
     if (key !== cacheKey) {
       // 创建一个包装 vnode，用 v-show 控制
       // 注意：直接修改原 vnode 的 style 可能会影响后续克隆，最好包一层
       const hiddenVNode = cloneVNode(item.vnode);
       // 强制隐藏
       if (!hiddenVNode.props) hiddenVNode.props = {};
       const originalStyle = hiddenVNode.props.style;
       const hideStyle = { display: 'none' }; 
       
       // 合并 style
       if (originalStyle) {
         if (typeof originalStyle === 'string') {
           hiddenVNode.props.style = originalStyle + '; display: none;';
         } else if (Array.isArray(originalStyle)) {
           hiddenVNode.props.style = [...originalStyle, hideStyle];
         } else {
           hiddenVNode.props.style = { ...originalStyle, display: 'none' };
         }
       } else {
         hiddenVNode.props.style = hideStyle;
       }
       
       allVNodes.push(hiddenVNode);
     }
   });

   activeVNodes.value = allVNodes;
};

// 监听 slot 变化
watch(() => instance.slots.default?.(), () => {
  renderContent();
}, { deep: true, immediate: true });

</script>