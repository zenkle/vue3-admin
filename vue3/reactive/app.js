/**
 * 应用逻辑 - 使用我们实现的响应式系统
 */

// ============== Demo 1: 基础响应式 ==============
const state1 = reactive({
    name: '访客'
})

// 创建 effect 来更新 DOM
effect(() => {
    document.getElementById('nameDisplay').textContent = state1.name
    document.getElementById('nameState').textContent = `name = "${state1.name}"`
})

// 监听 input 输入
document.getElementById('nameInput').addEventListener('input', (e) => {
    state1.name = e.target.value || '访客'
})

// ============== Demo 2: 计算属性 ==============
console.log('=== Demo 2: 初始化计算属性 ===')
const state2 = reactive({
    price: 10,
    quantity: 5
})

// 计算总价
const total = computed(() => {
    console.log('🔄 重新计算 total:', state2.price, '*', state2.quantity)
    return state2.price * state2.quantity
})

// 计算折扣价
const discount = computed(() => {
    console.log('🔄 重新计算 discount:', total.value, '* 0.9')
    return total.value * 0.9
})

// 更新显示
effect(() => {
    console.log('🎨 更新 totalDisplay:', total.value)
    document.getElementById('totalDisplay').textContent = total.value
})

effect(() => {
    console.log('🎨 更新 discountDisplay:', discount.value.toFixed(2))
    document.getElementById('discountDisplay').textContent = discount.value.toFixed(2)
})

console.log('✅ Demo 2 初始化完成，total.value =', total.value)

// 监听输入
document.getElementById('priceInput').addEventListener('input', (e) => {
    console.log('📝 修改 price:', e.target.value)
    state2.price = Number(e.target.value) || 0
})

document.getElementById('quantityInput').addEventListener('input', (e) => {
    console.log('📝 修改 quantity:', e.target.value)
    state2.quantity = Number(e.target.value) || 0
})

// ============== Demo 3: 深层响应式 ==============
console.log('=== Demo 3: 初始化深层响应式 ===')

const state3 = reactive({
    user: {
        name: '张三',
        address: {
            city: '北京'
        }
    },
    hobbies: ['读书', '游泳']
})

// 更新用户信息显示
function updateUserDisplay() {
    const userJson = JSON.stringify({
        name: state3.user.name,
        address: {
            city: state3.user.address.city
        }
    }, null, 2)
    document.getElementById('userDisplay').textContent = userJson
}

// 创建 effect 来追踪变化并更新 DOM
effect(() => {
    console.log('🎨 Demo 3 effect 触发')
    // 访问深层属性来建立依赖 - 关键：必须在 effect 中访问
    const name = state3.user.name
    const city = state3.user.address.city
    console.log('  - 读取到 name:', name)
    console.log('  - 读取到 city:', city)
    // 更新 DOM
    updateUserDisplay()
})

// 监听城市输入
document.getElementById('cityInput').addEventListener('input', (e) => {
    const newValue = e.target.value
    console.log('📝 修改 city:', newValue)
    state3.user.address.city = newValue
})

// 添加爱好的方法
window.app = {
    addHobby: () => {
        const newHobby = prompt('输入新的爱好：')
        if (newHobby) {
            console.log('📝 添加爱好:', newHobby)
            state3.hobbies.push(newHobby)
        }
    },
    // 测试方法：直接在控制台调用 app.testCity() 来测试
    testCity: (newCity) => {
        console.log('=== 测试修改城市 ===')
        console.log('修改前:', state3.user.address.city)
        state3.user.address.city = newCity || '上海'
        console.log('修改后:', state3.user.address.city)
    }
}

console.log('✅ Demo 3 初始化完成')
console.log('💡 提示：在控制台输入 app.testCity("上海") 可以测试修改城市')

// ============== 调试辅助 ==============
// 在控制台可以访问这些对象进行实验
console.log('🎮 Vue3 响应式原理 Demo')
console.log('可访问的对象：')
console.log('  state1 - 基础响应式')
console.log('  state2 - 计算属性相关')
console.log('  state3 - 深层响应式')
console.log('')
console.log('在控制台试试：')
console.log('  state1.name = "Claude"')
console.log('  state2.price = 100')
console.log('  state3.user.address.city = "上海"')
