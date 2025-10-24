<template>
  <div class="waimai-page">
    <!-- 顶部导航 -->
    <header class="waimai-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <span>←</span>
        </button>
        <h1 class="page-title">确认订单</h1>
        <div class="header-placeholder"></div>
      </div>
    </header>

    <!-- 收货地址 -->
    <section class="address-section">
      <div class="address-card" @click="selectAddress">
        <div class="address-icon">
          <span>📍</span>
        </div>
        <div class="address-info">
          <div class="address-main">
            <span class="receiver-name">{{ currentAddress.name }}</span>
            <span class="receiver-phone">{{ currentAddress.phone }}</span>
          </div>
          <div class="address-detail">{{ currentAddress.detail }}</div>
        </div>
        <div class="address-arrow">
          <span>></span>
        </div>
      </div>
    </section>

    <!-- 店铺信息 -->
    <section class="store-section">
      <div class="store-card">
        <div class="store-info">
          <h3 class="store-name">🥤 茶语时光</h3>
          <div class="store-tags">
            <span class="tag">新店特惠</span>
            <span class="tag">满减优惠</span>
          </div>
        </div>
        <div class="store-status">
          <span class="status-text">营业中</span>
        </div>
      </div>
    </section>

    <!-- 配送信息 -->
    <section class="delivery-section">
      <div class="delivery-card">
        <div class="delivery-item">
          <span class="delivery-label">配送方式</span>
          <span class="delivery-value">蜂鸟专送</span>
        </div>
        <div class="delivery-item">
          <span class="delivery-label">预计送达</span>
          <span class="delivery-value">{{ deliveryTime }}</span>
        </div>
        <div class="delivery-item">
          <span class="delivery-label">配送费</span>
          <span class="delivery-value">¥{{ deliveryFee }}</span>
        </div>
      </div>
    </section>

    <!-- 订单商品 -->
    <section class="order-section">
      <div class="order-header">
        <h3>订单详情</h3>
        <span class="item-count">{{ cartItems.length }}件商品</span>
      </div>
      <div class="order-items">
        <div v-for="item in cartItems" :key="item.id" class="order-item">
          <div class="item-image">
            <img :src="getProductImage(item.productId)" :alt="item.name" />
          </div>
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
            <p class="item-spec">{{ item.size }} | {{ item.sugar }} | {{ item.ice }}</p>
            <div class="item-price-quantity">
              <span class="item-price">¥{{ item.unitPrice.toFixed(2) }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 优惠券 -->
    <section class="coupon-section">
      <div class="coupon-card" @click="selectCoupon">
        <div class="coupon-icon">
          <span>🎫</span>
        </div>
        <div class="coupon-info">
          <span class="coupon-label">优惠券</span>
          <span class="coupon-value" v-if="selectedCoupon">
            已选择：{{ selectedCoupon.name }}
          </span>
          <span class="coupon-value" v-else> 选择优惠券 </span>
        </div>
        <div class="coupon-arrow">
          <span>></span>
        </div>
      </div>
    </section>

    <!-- 费用明细 -->
    <section class="cost-section">
      <div class="cost-card">
        <div class="cost-item">
          <span class="cost-label">商品小计</span>
          <span class="cost-value">¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">配送费</span>
          <span class="cost-value">¥{{ deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="cost-item" v-if="selectedCoupon">
          <span class="cost-label">优惠券</span>
          <span class="cost-value discount">-¥{{ selectedCoupon.discount.toFixed(2) }}</span>
        </div>
        <div class="cost-item">
          <span class="cost-label">包装费</span>
          <span class="cost-value">¥{{ packagingFee.toFixed(2) }}</span>
        </div>
        <div class="cost-divider"></div>
        <div class="cost-total">
          <span class="total-label">实付金额</span>
          <span class="total-value">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </section>

    <!-- 支付方式 -->
    <section class="payment-section">
      <div class="payment-card">
        <h3>支付方式</h3>
        <div class="payment-options">
          <div
            v-for="payment in paymentMethods"
            :key="payment.id"
            class="payment-option"
            :class="{ active: selectedPayment === payment.id }"
            @click="selectedPayment = payment.id"
          >
            <div class="payment-icon">
              <span>{{ payment.icon }}</span>
            </div>
            <span class="payment-name">{{ payment.name }}</span>
            <div class="payment-radio">
              <span v-if="selectedPayment === payment.id">●</span>
              <span v-else>○</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 备注 -->
    <section class="remark-section">
      <div class="remark-card">
        <h3>订单备注</h3>
        <textarea
          v-model="orderRemark"
          placeholder="有什么特殊要求吗？"
          class="remark-input"
        ></textarea>
      </div>
    </section>

    <!-- 底部提交栏 -->
    <div class="submit-section">
      <div class="submit-info">
        <div class="submit-total">
          <span class="total-label">实付</span>
          <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="submit-tip">已优惠¥{{ discountAmount.toFixed(2) }}</div>
      </div>
      <button class="submit-btn" :disabled="!canSubmit" @click="submitOrder">
        {{ canSubmit ? '提交订单' : '请选择收货地址' }}
      </button>
    </div>

    <!-- 地址选择弹窗 -->
    <div v-if="showAddressModal" class="modal-overlay" @click="showAddressModal = false">
      <div class="address-modal" @click.stop>
        <div class="modal-header">
          <h3>选择收货地址</h3>
          <button class="close-btn" @click="showAddressModal = false">×</button>
        </div>
        <div class="modal-content">
          <div
            v-for="address in addressList"
            :key="address.id"
            class="address-item"
            :class="{ active: currentAddress.id === address.id }"
            @click="selectCurrentAddress(address)"
          >
            <div class="address-main">
              <span class="receiver-name">{{ address.name }}</span>
              <span class="receiver-phone">{{ address.phone }}</span>
            </div>
            <div class="address-detail">{{ address.detail }}</div>
            <div class="address-actions">
              <button class="edit-btn" @click.stop="editAddress(address)">编辑</button>
              <button class="delete-btn" @click.stop="deleteAddress(address)">删除</button>
            </div>
          </div>
          <button class="add-address-btn" @click="addAddress">+ 添加新地址</button>
        </div>
      </div>
    </div>

    <!-- 优惠券选择弹窗 -->
    <div v-if="showCouponModal" class="modal-overlay" @click="showCouponModal = false">
      <div class="coupon-modal" @click.stop>
        <div class="modal-header">
          <h3>选择优惠券</h3>
          <button class="close-btn" @click="showCouponModal = false">×</button>
        </div>
        <div class="modal-content">
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-item"
            :class="{ active: selectedCoupon?.id === coupon.id }"
            @click="selectCurrentCoupon(coupon)"
          >
            <div class="coupon-info">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-desc">{{ coupon.description }}</div>
              <div class="coupon-expire">有效期至：{{ coupon.expireDate }}</div>
            </div>
            <div class="coupon-discount">¥{{ coupon.discount }}</div>
          </div>
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

// 从全局状态获取购物车数据
const cartItems = computed(() => cartStore.cartItems)

const currentAddress = ref({
  id: 1,
  name: '张三',
  phone: '138****8888',
  detail: '北京市朝阳区三里屯街道工体北路8号院1号楼2单元301室',
})

const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    detail: '北京市朝阳区三里屯街道工体北路8号院1号楼2单元301室',
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    detail: '北京市海淀区中关村大街1号海龙大厦A座1208室',
  },
])

const selectedCoupon = ref(null)
const selectedPayment = ref(1)
const orderRemark = ref('')
const showAddressModal = ref(false)
const showCouponModal = ref(false)

// 配送信息
const deliveryTime = ref('30-40分钟')
const deliveryFee = ref(3)
const packagingFee = ref(1)

// 支付方式
const paymentMethods = ref([
  { id: 1, name: '微信支付', icon: '💚' },
  { id: 2, name: '支付宝', icon: '💙' },
  { id: 3, name: '银行卡', icon: '💳' },
])

// 优惠券
const availableCoupons = ref([
  {
    id: 1,
    name: '新用户专享',
    description: '满30减5元',
    discount: 5,
    expireDate: '2024-12-31',
  },
  {
    id: 2,
    name: '满减优惠',
    description: '满50减10元',
    discount: 10,
    expireDate: '2024-12-31',
  },
])

// 计算属性
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.totalPrice, 0)
})

const discountAmount = computed(() => {
  return selectedCoupon.value ? selectedCoupon.value.discount : 0
})

const totalAmount = computed(() => {
  return subtotal.value + deliveryFee.value + packagingFee.value - discountAmount.value
})

const canSubmit = computed(() => {
  return currentAddress.value && cartItems.value.length > 0
})

// 方法
const goBack = () => {
  // 返回上一页
  router.back()
}

const selectAddress = () => {
  showAddressModal.value = true
}

const selectCoupon = () => {
  showCouponModal.value = true
}

const selectCurrentAddress = (address) => {
  currentAddress.value = address
  showAddressModal.value = false
}

const selectCurrentCoupon = (coupon) => {
  selectedCoupon.value = coupon
  showCouponModal.value = false
}

const editAddress = (address) => {
  // 编辑地址逻辑
  console.log('编辑地址', address)
}

const deleteAddress = (address) => {
  // 删除地址逻辑
  console.log('删除地址', address)
}

const addAddress = () => {
  // 添加地址逻辑
  console.log('添加地址')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductImage = (productId: number) => {
  // 根据产品ID获取图片
  return 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=100&h=100&fit=crop'
}

const submitOrder = () => {
  if (canSubmit.value) {
    // 提交订单逻辑
    alert('订单提交成功！')
  }
}

onMounted(() => {
  // 初始化
  console.log('外卖页面已加载')
  console.log('购物车商品:', cartItems.value)
  console.log('购物车总价:', cartStore.cartTotal)
  console.log('购物车商品数量:', cartStore.cartItemCount)
})
</script>

<style scoped>
.waimai-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  padding-bottom: 80px; /* 为底部提交栏留出空间 */
}

/* 顶部导航 */
.waimai-header {
  background: white;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f0f0f0;
}

.page-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.header-placeholder {
  width: 40px;
}

/* 收货地址 */
.address-section {
  margin: 0.5rem 1rem;
}

.address-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.address-icon {
  font-size: 1.5rem;
  color: #ff6b6b;
}

.address-info {
  flex: 1;
}

.address-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.receiver-name {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

.receiver-phone {
  color: #666;
  font-size: 0.9rem;
}

.address-detail {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.address-arrow {
  color: #999;
  font-size: 1.2rem;
}

/* 店铺信息 */
.store-section {
  margin: 0.5rem 1rem;
}

.store-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.store-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.store-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: #fff3cd;
  color: #856404;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.status-text {
  color: #28a745;
  font-weight: bold;
  font-size: 0.9rem;
}

/* 配送信息 */
.delivery-section {
  margin: 0.5rem 1rem;
}

.delivery-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.delivery-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.delivery-item:last-child {
  border-bottom: none;
}

.delivery-label {
  color: #666;
  font-size: 0.9rem;
}

.delivery-value {
  color: #333;
  font-weight: 500;
}

/* 订单商品 */
.order-section {
  margin: 0.5rem 1rem;
}

.order-header {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.item-count {
  color: #666;
  font-size: 0.9rem;
}

.order-items {
  background: white;
  border-radius: 0 0 12px 12px;
  padding: 0 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.item-spec {
  color: #666;
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
}

.item-price-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1rem;
}

.item-quantity {
  color: #666;
  font-size: 0.9rem;
}

/* 优惠券 */
.coupon-section {
  margin: 0.5rem 1rem;
}

.coupon-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.coupon-icon {
  font-size: 1.5rem;
  color: #ff6b6b;
}

.coupon-info {
  flex: 1;
}

.coupon-label {
  color: #666;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
}

.coupon-value {
  color: #333;
  font-weight: 500;
}

.coupon-arrow {
  color: #999;
  font-size: 1.2rem;
}

/* 费用明细 */
.cost-section {
  margin: 0.5rem 1rem;
}

.cost-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.cost-label {
  color: #666;
  font-size: 0.9rem;
}

.cost-value {
  color: #333;
  font-weight: 500;
}

.cost-value.discount {
  color: #28a745;
}

.cost-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0.5rem 0;
}

.cost-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0 0;
}

.total-label {
  color: #333;
  font-weight: bold;
  font-size: 1.1rem;
}

.total-value {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 支付方式 */
.payment-section {
  margin: 0.5rem 1rem;
}

.payment-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.payment-option:hover {
  background: #f8f9fa;
}

.payment-option.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.payment-icon {
  font-size: 1.5rem;
}

.payment-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.payment-radio {
  color: #2196f3;
  font-size: 1.2rem;
}

/* 备注 */
.remark-section {
  margin: 0.5rem 1rem;
}

.remark-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remark-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.remark-input {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  font-family: inherit;
}

.remark-input:focus {
  outline: none;
  border-color: #2196f3;
}

/* 底部提交栏 */
.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.submit-info {
  flex: 1;
}

.submit-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.total-label {
  color: #666;
  font-size: 0.9rem;
}

.total-amount {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.3rem;
}

.submit-tip {
  color: #28a745;
  font-size: 0.8rem;
}

.submit-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background: #ff5252;
  transform: translateY(-2px);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.address-modal,
.coupon-modal {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.close-btn {
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

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.address-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-item:hover {
  border-color: #2196f3;
  background: #f8f9fa;
}

.address-item.active {
  border-color: #2196f3;
  background: #e3f2fd;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.edit-btn,
.delete-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #2196f3;
}

.delete-btn:hover {
  background: #ffebee;
  border-color: #f44336;
  color: #f44336;
}

.add-address-btn {
  width: 100%;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.add-address-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.coupon-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-item:hover {
  border-color: #2196f3;
  background: #f8f9fa;
}

.coupon-item.active {
  border-color: #2196f3;
  background: #e3f2fd;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.coupon-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.coupon-expire {
  color: #999;
  font-size: 0.8rem;
}

.coupon-discount {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waimai-page {
    padding-bottom: 90px;
  }

  .address-section,
  .store-section,
  .delivery-section,
  .order-section,
  .coupon-section,
  .cost-section,
  .payment-section,
  .remark-section {
    margin: 0.5rem 0.75rem;
  }

  .submit-section {
    padding: 0.75rem;
  }

  .submit-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .address-modal,
  .coupon-modal {
    max-width: 95%;
  }
}
</style>
