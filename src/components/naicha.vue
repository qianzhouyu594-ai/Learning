<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="naicha-app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <h1 class="logo">🥤 忧茶</h1>
      </div>
    </header>

    <!-- 骨架屏（加载中） -->
    <div v-if="loading" class="main-content skeleton-wrap">
      <aside class="sidebar">
        <nav class="category-nav">
          <div class="category-list">
            <div v-for="n in 7" :key="n" class="category-skeleton shimmer"></div>
          </div>
        </nav>
      </aside>

      <main class="product-section">
        <div class="section-header">
          <div class="skeleton-line shimmer" style="width: 160px; height: 24px"></div>
          <div
            class="skeleton-line shimmer"
            style="width: 220px; height: 14px; margin-top: 8px"
          ></div>
        </div>
        <div class="product-grid">
          <div v-for="n in 6" :key="n" class="product-card product-skeleton">
            <div class="product-image">
              <div class="skeleton-box shimmer"></div>
            </div>
            <div class="product-info">
              <div class="skeleton-line shimmer" style="width: 60%; height: 16px"></div>
              <div
                class="skeleton-line shimmer"
                style="width: 90%; height: 12px; margin-top: 8px"
              ></div>
              <div
                class="skeleton-line shimmer"
                style="width: 40%; height: 18px; margin-top: 12px"
              ></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content" v-else>
      <!-- 左侧分类边栏 -->
      <aside class="sidebar">
        <nav class="category-nav">
          <div class="category-list">
            <button
              v-for="category in categories"
              :key="category.id"
              :class="['category-btn', { active: selectedCategory === category.id }]"
              @click="selectedCategory = category.id"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </button>
          </div>
        </nav>
      </aside>

      <!-- 右侧产品展示区域 -->
      <main class="product-section">
        <div class="section-header">
          <h2>{{ getCurrentCategoryName() }}</h2>
          <p class="section-desc">{{ getCurrentCategoryDesc() }}</p>
        </div>
        <div class="product-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="selectProduct(product)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <div class="product-badge" v-if="product.isHot">🔥 热销</div>
              <div class="product-badge" v-if="product.isRecommended">⭐ 推荐</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div class="product-tags">
                <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="selectedProduct" class="modal-overlay" @click="closeProductModal">
      <div class="product-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedProduct.name }}</h2>
          <button class="close-btn" @click="closeProductModal">×</button>
        </div>
        <div class="modal-content">
          <div class="product-image-large">
            <img :src="selectedProduct.image" :alt="selectedProduct.name" />
          </div>
          <div class="product-details">
            <p class="product-description">{{ selectedProduct.description }}</p>
            <div class="price-section">
              <span class="current-price">¥{{ selectedProduct.price }}</span>
              <span class="original-price" v-if="selectedProduct.originalPrice"
                >¥{{ selectedProduct.originalPrice }}</span
              >
            </div>

            <!-- 规格选择 -->
            <div class="size-section">
              <h4>选择规格</h4>
              <div class="size-options">
                <button
                  v-for="size in selectedProduct.sizes"
                  :key="size.name"
                  :class="['size-btn', { active: selectedSize === size.name }]"
                  @click="selectedSize = size.name"
                >
                  {{ size.name }} (+¥{{ size.price }})
                </button>
              </div>
            </div>

            <!-- 糖度选择 -->
            <div class="sugar-section">
              <h4>糖度</h4>
              <div class="sugar-options">
                <button
                  v-for="sugar in sugarOptions"
                  :key="sugar"
                  :class="['sugar-btn', { active: selectedSugar === sugar }]"
                  @click="selectedSugar = sugar"
                >
                  {{ sugar }}
                </button>
              </div>
            </div>

            <!-- 冰度选择 -->
            <div class="ice-section">
              <h4>冰度</h4>
              <div class="ice-options">
                <button
                  v-for="ice in iceOptions"
                  :key="ice"
                  :class="['ice-btn', { active: selectedIce === ice }]"
                  @click="selectedIce = ice"
                >
                  {{ ice }}
                </button>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="quantity-section">
              <h4>数量</h4>
              <div class="quantity-controls">
                <button class="qty-btn" @click="decreaseQuantity">-</button>
                <span class="quantity">{{ quantity }}</span>
                <button class="qty-btn" @click="increaseQuantity">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="total-price">总计: ¥{{ totalPrice }}</div>
          <button class="add-to-cart-btn" @click="addToCart">加入购物车</button>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <div class="bottom-cart" :class="{ 'has-items': cartStore.cartItemCount > 0 }">
      <div class="cart-info" @click="cartStore.toggleCart()">
        <div class="cart-icon">
          <span class="cart-icon-symbol">🛒</span>
          <span class="cart-count" v-if="cartStore.cartItemCount > 0">{{
            cartStore.cartItemCount
          }}</span>
        </div>
        <div class="cart-details">
          <div class="cart-total">¥{{ cartStore.cartTotal.toFixed(2) }}</div>
          <div class="delivery-info" v-if="cartStore.cartTotal < 20">
            还差¥{{ (20 - cartStore.cartTotal).toFixed(2) }}起送
          </div>
          <div class="delivery-info" v-else>已满起送价</div>
        </div>
      </div>
      <button class="checkout-btn" :disabled="!cartStore.canCheckout" @click="goToCheckout">
        {{ cartStore.canCheckout ? '去结算' : '还差¥' + (20 - cartStore.cartTotal).toFixed(2) }}
      </button>
    </div>

    <!-- 购物车弹窗 -->
    <div v-if="cartStore.showCart" class="cart-modal-overlay" @click="cartStore.closeCart()">
      <div class="cart-modal" @click.stop>
        <div class="cart-modal-header">
          <h3>购物车</h3>
          <button class="close-cart-btn" @click="cartStore.closeCart()">×</button>
        </div>
        <div class="cart-modal-content">
          <div v-if="cartStore.cartItemCount === 0" class="empty-cart">
            <p>购物车是空的</p>
          </div>
          <div v-else>
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.size }} | {{ item.sugar }} | {{ item.ice }}</p>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button @click="decreaseCartQuantity(item)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="increaseCartQuantity(item)">+</button>
                </div>
                <div class="item-price">¥{{ item.totalPrice.toFixed(2) }}</div>
                <!-- <button class="remove-btn" @click="removeFromCart(item)">删除</button> -->
              </div>
            </div>
          </div>
        </div>
        <div class="cart-modal-footer">
          <div class="cart-total-info">
            <span>总计: ¥{{ cartStore.cartTotal.toFixed(2) }}</span>
            <span v-if="cartStore.cartTotal < 20" class="delivery-tip">
              还差¥{{ (20 - cartStore.cartTotal).toFixed(2) }}起送
            </span>
          </div>
          <button
            class="checkout-btn-modal"
            :disabled="!cartStore.canCheckout"
            @click="goToCheckout"
          >
            {{ cartStore.canCheckout ? '去结算' : '还差¥' + (20 - cartStore.cartTotal).toFixed(2) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

// 从 store 中获取状态
const selectedCategory = computed({
  get: () => cartStore.selectedCategory,
  set: (value) => cartStore.setSelectedCategory(value),
})

const selectedProduct = computed({
  get: () => cartStore.selectedProduct,
  set: (value) => cartStore.setSelectedProduct(value),
})

const selectedSize = computed({
  get: () => cartStore.selectedSize,
  set: (value) => cartStore.setSelectedSize(value),
})

const selectedSugar = computed({
  get: () => cartStore.selectedSugar,
  set: (value) => cartStore.setSelectedSugar(value),
})

const selectedIce = computed({
  get: () => cartStore.selectedIce,
  set: (value) => cartStore.setSelectedIce(value),
})

const quantity = computed({
  get: () => cartStore.quantity,
  set: (value) => cartStore.setQuantity(value),
})

const cartItems = computed(() => cartStore.cartItems)

// 骨架屏加载状态
const loading = ref(true)

// 分类数据
const categories = ref([
  { id: 1, name: '推荐', icon: '⭐', desc: '精选推荐，不容错过' },
  { id: 2, name: '热销', icon: '🔥', desc: '人气爆款，销量冠军' },
  { id: 3, name: '进店必选', icon: '💎', desc: '招牌产品，进店必点' },
  { id: 4, name: '经典奶茶', icon: '🥤', desc: '经典口味，历久弥新' },
  { id: 5, name: '果茶系列', icon: '🍓', desc: '新鲜果香，清爽怡人' },
  { id: 6, name: '创意奶咖', icon: '☕', desc: '创新搭配，独特风味' },
  { id: 7, name: '小食甜点', icon: '🍰', desc: '精致小食，甜蜜享受' },
])

// 产品数据
const products = ref([
  // 推荐
  {
    id: 1,
    categoryId: 1,
    name: '招牌珍珠奶茶',
    description: '经典珍珠奶茶，Q弹珍珠配香浓奶茶',
    price: 15,
    originalPrice: 18,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    isRecommended: true,
    tags: ['推荐', '经典'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 热销
  {
    id: 2,
    categoryId: 2,
    name: '草莓果茶',
    description: '新鲜草莓制作，酸甜可口',
    price: 16,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    isHot: true,
    tags: ['热销', '果茶'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  {
    id: 3,
    categoryId: 2,
    name: '芒果果茶',
    description: '香甜芒果，夏日必备',
    price: 18,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    isHot: true,
    tags: ['热销', '芒果'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 进店必选
  {
    id: 4,
    categoryId: 3,
    name: '芝士奶盖茶',
    description: '浓郁芝士奶盖配清香茶底',
    price: 20,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    isRecommended: true,
    tags: ['必选', '芝士'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 经典奶茶
  {
    id: 5,
    categoryId: 4,
    name: '布丁奶茶',
    description: '嫩滑布丁与香浓奶茶的完美结合',
    price: 14,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    tags: ['经典', '嫩滑'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  {
    id: 6,
    categoryId: 4,
    name: '红豆奶茶',
    description: '香甜红豆配香浓奶茶',
    price: 13,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    tags: ['经典', '红豆'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 果茶系列
  {
    id: 7,
    categoryId: 5,
    name: '柠檬蜂蜜茶',
    description: '清新柠檬配天然蜂蜜',
    price: 12,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    tags: ['果茶', '柠檬'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  {
    id: 8,
    categoryId: 5,
    name: '葡萄果茶',
    description: '新鲜葡萄，酸甜清爽',
    price: 17,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    tags: ['果茶', '葡萄'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 创意奶咖
  {
    id: 9,
    categoryId: 6,
    name: '抹茶拿铁',
    description: '日式抹茶配香浓牛奶',
    price: 19,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    tags: ['创意', '抹茶'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  {
    id: 10,
    categoryId: 6,
    name: '焦糖玛奇朵',
    description: '香浓焦糖配丝滑咖啡',
    price: 22,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    tags: ['创意', '咖啡'],
    sizes: [
      { name: '中杯', price: 0 },
      { name: '大杯', price: 3 },
    ],
  },
  // 小食甜点
  {
    id: 11,
    categoryId: 7,
    name: '芝士蛋糕',
    description: '浓郁芝士，入口即化',
    price: 25,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
    tags: ['甜点', '芝士'],
    sizes: [
      { name: '小份', price: 0 },
      { name: '大份', price: 5 },
    ],
  },
  {
    id: 12,
    categoryId: 7,
    name: '提拉米苏',
    description: '意式经典，层次丰富',
    price: 28,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop',
    tags: ['甜点', '意式'],
    sizes: [
      { name: '小份', price: 0 },
      { name: '大份', price: 5 },
    ],
  },
])

// 糖度选项
const sugarOptions = ['无糖', '微糖', '半糖', '正常糖', '多糖']

// 冰度选项
const iceOptions = ['去冰', '微冰', '正常冰', '多冰']

// 计算属性
const filteredProducts = computed(() => {
  if (selectedCategory.value === 1) {
    // 推荐：显示所有推荐产品
    return products.value.filter((product) => product.isRecommended)
  } else if (selectedCategory.value === 2) {
    // 热销：显示所有热销产品
    return products.value.filter((product) => product.isHot)
  } else {
    // 其他分类：按分类ID筛选
    return products.value.filter((product) => product.categoryId === selectedCategory.value)
  }
})

const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0
  const sizePrice =
    selectedProduct.value.sizes.find((s) => s.name === selectedSize.value)?.price || 0
  return (selectedProduct.value.price + sizePrice) * quantity.value
})

// 获取当前分类名称
const getCurrentCategoryName = () => {
  const category = categories.value.find((cat) => cat.id === selectedCategory.value)
  return category ? category.name : '推荐'
}

// 获取当前分类描述
const getCurrentCategoryDesc = () => {
  const category = categories.value.find((cat) => cat.id === selectedCategory.value)
  return category ? category.desc : '精选推荐，不容错过'
}

// 方法
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectProduct = (product: any) => {
  cartStore.setSelectedProduct(product)
}

const closeProductModal = () => {
  cartStore.setSelectedProduct(null)
}

const increaseQuantity = () => {
  cartStore.setQuantity(cartStore.quantity + 1)
}

const decreaseQuantity = () => {
  if (cartStore.quantity > 1) {
    cartStore.setQuantity(cartStore.quantity - 1)
  }
}

const addToCart = () => {
  if (selectedProduct.value) {
    cartStore.addToCart(
      selectedProduct.value,
      selectedSize.value,
      selectedSugar.value,
      selectedIce.value,
      quantity.value,
    )
    closeProductModal()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const increaseCartQuantity = (item: any) => {
  cartStore.increaseCartQuantity(item.id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decreaseCartQuantity = (item: any) => {
  cartStore.decreaseCartQuantity(item.id)
}

// const removeFromCart = (item: any) => {
//   cartStore.removeFromCart(item.id)
// }

// 去结算
const goToCheckout = () => {
  console.log('点击去结算按钮')
  console.log('购物车总价:', cartStore.cartTotal)
  console.log('是否满足起送价:', cartStore.canCheckout)
  console.log('购物车商品:', cartStore.cartItems)

  if (cartStore.canCheckout) {
    console.log('开始跳转到外卖结算页面')
    try {
      router.push('/waimai')
      console.log('路由跳转成功')
    } catch (error) {
      console.error('路由跳转失败:', error)
    }
  } else {
    console.log('未满足起送价，无法跳转')
  }
}

onMounted(() => {
  // 初始化
  // 模拟首屏数据/资源准备完成后关闭骨架屏
  requestAnimationFrame(() => {
    setTimeout(() => {
      loading.value = false
    }, 300) // 可按实际情况调整
  })
})
</script>

<style scoped>
.naicha-app {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.main-content {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar {
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  flex-shrink: 0;
}

.category-nav {
  padding: 1rem 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.category-btn {
  background: white;
  border: 1px solid #e9ecef;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  font-size: 0.9rem;
  color: #495057;
}

.category-btn:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.category-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  transform: translateX(4px);
}

.category-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.category-name {
  font-weight: 500;
}

.product-section {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}

.section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.section-desc {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.product-desc {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ff6b6b;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.product-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.product-modal {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-content {
  padding: 1.5rem;
}

.product-image-large {
  text-align: center;
  margin-bottom: 1.5rem;
}

.product-image-large img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 15px;
}

.product-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.price-section {
  margin-bottom: 1.5rem;
}

.current-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.size-section,
.sugar-section,
.ice-section,
.quantity-section {
  margin-bottom: 1.5rem;
}

.size-section h4,
.sugar-section h4,
.ice-section h4,
.quantity-section h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.size-options,
.sugar-options,
.ice-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.size-btn,
.sugar-btn,
.ice-btn {
  background: #f0f0f0;
  border: 2px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.size-btn.active,
.sugar-btn.active,
.ice-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.qty-btn {
  background: #f0f0f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  background: #e0e0e0;
}

.quantity {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
}

.total-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ff6b6b;
}

.add-to-cart-btn {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

/* 底部购物车栏 */
.bottom-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.bottom-cart.has-items {
  background: #34495e;
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  flex: 1;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
}

.cart-icon-symbol {
  display: block;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.cart-details {
  flex: 1;
}

.cart-total {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.delivery-info {
  font-size: 0.9rem;
  color: #bdc3c7;
}

.checkout-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.checkout-btn:disabled {
  background: #7f8c8d;
  cursor: not-allowed;
}

.checkout-btn:not(:disabled):hover {
  background: #2ecc71;
  transform: translateY(-2px);
}

/* 购物车弹窗 */
.cart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cart-modal {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.cart-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0;
  background: #f8f9fa;
}

.cart-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.close-cart-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-cart-btn:hover {
  background: #e9ecef;
  color: #333;
}

.cart-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-cart p {
  font-size: 1.1rem;
  margin: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-controls .quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-controls .quantity-controls button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: #495057;
  transition: all 0.3s ease;
}

.item-controls .quantity-controls button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.item-controls .quantity-controls span {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.item-price {
  font-weight: bold;
  color: #e74c3c;
  min-width: 60px;
  text-align: right;
  font-size: 1.1rem;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.cart-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 15px 15px;
}

.cart-total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cart-total-info span:first-child {
  font-size: 1.3rem;
  font-weight: bold;
  color: #e74c3c;
}

.delivery-tip {
  font-size: 0.9rem;
  color: #6c757d;
}

.checkout-btn-modal {
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.checkout-btn-modal:disabled {
  background: #7f8c8d;
  cursor: not-allowed;
}

.checkout-btn-modal:not(:disabled):hover {
  background: #2ecc71;
  transform: translateY(-2px);
}

/* 骨架屏样式 */
.skeleton-wrap {
  background: #fff;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    left: 150%;
  }
}

.category-skeleton {
  height: 48px;
  border-radius: 8px;
  background: #eee;
}

.product-skeleton .product-image .skeleton-box {
  width: 100%;
  height: 200px;
  background: #eee;
}

.skeleton-line {
  background: #eee;
  border-radius: 6px;
}

/* 响应式设计 */

/* 平板端 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .main-content {
    max-width: 100%;
    margin: 0;
  }

  .sidebar {
    width: 200px;
  }

  .product-section {
    padding: 1.5rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.2rem;
  }
}

/* 手机端 (768px 以下) */
@media (max-width: 768px) {
  .naicha-app {
    padding-bottom: 80px; /* 为底部购物车留出空间 */
  }

  .header {
    padding: 0.75rem 0;
  }

  .header-content {
    padding: 0 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .main-content {
    flex-direction: row; /* 保持左右分栏布局 */
    margin: 0;
    box-shadow: none;
    height: calc(100vh - 60px); /* 减去header高度 */
  }

  .sidebar {
    width: 80px; /* 窄窄的侧边栏 */
    order: 1;
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    flex-shrink: 0;
    overflow-y: auto;
  }

  .category-nav {
    padding: 0.5rem 0;
  }

  .category-list {
    flex-direction: column; /* 垂直排列 */
    padding: 0 0.5rem;
    gap: 0.5rem;
  }

  .category-btn {
    flex-direction: column; /* 垂直布局 */
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    font-size: 0.7rem;
    min-width: auto;
    width: 100%;
    white-space: nowrap;
    border-radius: 8px;
    background: white;
    border: 1px solid #e9ecef;
    text-align: center;
    min-height: 60px;
  }

  .category-btn:hover {
    transform: none;
    background: #e9ecef;
  }

  .category-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: none;
  }

  .category-icon {
    font-size: 1.2rem;
    width: auto;
    margin-bottom: 0.25rem;
  }

  .category-name {
    font-size: 0.7rem;
    line-height: 1.2;
    word-break: break-all;
  }

  .product-section {
    order: 2;
    padding: 1rem;
    max-height: none;
    background: #f8f9fa;
    flex: 1;
    overflow-y: auto;
  }

  .section-header {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }

  .section-header h2 {
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
  }

  .section-desc {
    font-size: 0.9rem;
  }

  /* 手机端产品网格 - 一行一个商品 */
  .product-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .product-card {
    display: flex;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 120px;
  }

  .product-card:hover {
    transform: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .product-image {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: white;
    padding: 0.2rem 0.4rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
  }

  .product-info {
    flex: 1;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-name {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin: 0 0 0.25rem 0;
    line-height: 1.2;
  }

  .product-desc {
    color: #666;
    font-size: 0.8rem;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ff6b6b;
  }

  .original-price {
    font-size: 0.9rem;
    color: #999;
    text-decoration: line-through;
  }

  .product-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .tag {
    background: #f0f0f0;
    color: #666;
    padding: 0.15rem 0.4rem;
    border-radius: 8px;
    font-size: 0.7rem;
  }

  /* 底部购物车优化 */
  .bottom-cart {
    padding: 0.75rem 1rem;
    background: #2c3e50;
  }

  .cart-info {
    gap: 0.75rem;
  }

  .cart-icon {
    font-size: 1.3rem;
  }

  .cart-count {
    width: 18px;
    height: 18px;
    font-size: 0.75rem;
  }

  .cart-total {
    font-size: 1.1rem;
  }

  .delivery-info {
    font-size: 0.8rem;
  }

  .checkout-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    min-width: 90px;
    border-radius: 20px;
  }

  /* 购物车弹窗优化 */
  .cart-modal {
    max-width: 95%;
    margin: 0.5rem;
    max-height: 85vh;
  }

  .cart-modal-header {
    padding: 1rem;
  }

  .cart-modal-header h3 {
    font-size: 1.1rem;
  }

  .cart-modal-content {
    padding: 0.75rem;
  }

  .cart-item {
    padding: 0.75rem 0;
  }

  .item-info h4 {
    font-size: 0.95rem;
  }

  .item-info p {
    font-size: 0.8rem;
  }

  .item-controls .quantity-controls button {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  .item-price {
    font-size: 1rem;
  }

  .remove-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }

  .cart-modal-footer {
    padding: 1rem;
  }

  .cart-total-info span:first-child {
    font-size: 1.2rem;
  }

  .checkout-btn-modal {
    padding: 0.8rem;
    font-size: 0.95rem;
  }

  /* 产品详情弹窗优化 */
  .product-modal {
    max-width: 95%;
    margin: 0.5rem;
    max-height: 90vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1.2rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .product-image-large img {
    width: 150px;
    height: 150px;
  }

  .size-options,
  .sugar-options,
  .ice-options {
    gap: 0.4rem;
  }

  .size-btn,
  .sugar-btn,
  .ice-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }

  .qty-btn {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .modal-footer {
    padding: 1rem;
  }

  .total-price {
    font-size: 1.2rem;
  }

  .add-to-cart-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* 超小屏幕 (480px 以下) */
@media (max-width: 480px) {
  .header-content {
    padding: 0 0.75rem;
  }

  .logo {
    font-size: 1.3rem;
  }

  .main-content {
    height: calc(100vh - 55px); /* 调整高度 */
  }

  .sidebar {
    width: 70px; /* 更窄的侧边栏 */
  }

  .category-btn {
    padding: 0.6rem 0.3rem;
    font-size: 0.65rem;
    min-height: 55px;
  }

  .category-icon {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .category-name {
    font-size: 0.65rem;
    line-height: 1.1;
  }

  .product-section {
    padding: 0.75rem;
  }

  .product-card {
    height: 100px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .product-info {
    padding: 0.6rem;
  }

  .product-name {
    font-size: 0.9rem;
  }

  .product-desc {
    font-size: 0.75rem;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .price {
    font-size: 1rem;
  }

  .original-price {
    font-size: 0.8rem;
  }

  .tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.3rem;
  }

  .bottom-cart {
    padding: 0.6rem 0.75rem;
  }

  .cart-total {
    font-size: 1rem;
  }

  .delivery-info {
    font-size: 0.75rem;
  }

  .checkout-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    min-width: 80px;
  }
}
</style>
