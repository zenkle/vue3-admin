# 可视化大屏响应式设计方案

## 目标
在 Vue3 项目中实现支持多设备的可视化大屏，包括大屏（1080p/2K/4K）、电脑、平板和手机。

## 设备分级策略

### 大屏（≥1920px）
- 使用 transform:scale() 保持设计稿比例
- 基于 1920x1080 设计稿
- 居中显示，背景填充避免黑边

### 电脑浏览器（1024px - 1919px）
- 流体布局，使用 vw/vh/% 单位
- 完全填充屏幕
- 保持内容比例和可读性

### 平板（768px - 1023px）
- 调整布局密度
- 优化触摸交互
- 可能简化部分组件

### 手机（<768px）
- 垂直堆叠布局
- 触摸优化
- 隐藏次要内容
- 允许页面滚动

## 技术方案

### 响应式实现方式
采用**方案 A：媒体查询 + 断点切换**
- 使用 CSS 媒体查询定义不同断点
- CSS Grid + Flexbox 实现灵活布局
- 纯 CSS 实现，性能好

### 响应式断点
```scss
$breakpoint-large-screen: 1920px;  // 大屏
$breakpoint-desktop: 1024px;       // 电脑
$breakpoint-tablet: 768px;         // 平板
// < 768px 手机
```

## 样式架构

### 文件结构
```
src/styles/
├── main.scss          # 全局基础样式 + 响应式断点
├── variables.scss     # 断点变量、颜色变量
└── screen.scss        # 大屏专用（scale 逻辑）
```

### 样式优先级
1. normalize.css - 重置浏览器默认样式
2. main.scss - 全局基础样式
3. screen.scss - 大屏适配样式
4. 组件 scoped 样式 - 具体组件样式

### 核心样式规则
```scss
// 大屏（≥1920px）
html, body, #app: 100% 宽高，overflow: hidden
.container: transform scale()

// 电脑/平板/手机
html, body: 允许滚动
#app: 流体布局，使用 flex/grid
```

## 组件结构

```
Screen/index.vue (主容器)
├── ScreenHeader.vue (头部组件)
│   ├── 标题
│   └── 时间/日期显示
└── ScreenContent.vue (内容容器)
    └── 具体的图表/数据组件
```

### 职责划分
- `Screen/index.vue`: 响应式布局容器，大屏时处理缩放逻辑
- `ScreenHeader.vue`: 头部布局和样式，响应式调整
- `ScreenContent.vue`: 内容区域容器框架

## 数据流与逻辑

### 缩放计算逻辑（仅大屏）
```
window resize → 计算新 scale → 更新 container transform
                 ↓
            监听器 (防抖 100-200ms)
```

### 响应式状态
```typescript
// Screen 组件内部状态
scale: number           // 当前缩放比例（仅大屏）
containerWidth: 1920    // 设计稿宽度
containerHeight: 1080   // 设计稿高度
```

## 边界处理

### 极小屏幕
- 设置最小 scale 阈值（0.5）
- 移动端切换到垂直布局

### 超宽屏
- 保持 16:9 比例
- 左右居中，背景填充

### 窗口 resize
- 使用防抖优化性能
- 大屏重新计算 scale
- 其他断点自动响应

## 测试要点

1. **不同分辨率测试**
   - 1920x1080、2560x1440、3840x2160
   - 1366x768、1440x900

2. **设备测试**
   - 大屏显示器
   - 笔记本/台式机
   - iPad/平板
   - 手机（iOS/Android）

3. **交互测试**
   - 窗口缩放
   - 内容溢出
   - 触摸交互

## 实施文件清单

1. `src/style.css` - 修改全局基础样式
2. `src/styles/main.scss` - 添加响应式样式
3. `src/styles/variables.scss` - 添加断点变量
4. `src/App.vue` - 调整 #app 样式
5. `src/views/Screen/index.vue` - 实现响应式布局

## 依赖

- normalize.css（已安装）
- sass（已安装）
- 无需额外依赖
