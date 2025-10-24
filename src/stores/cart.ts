import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义购物车商品类型
export interface CartItem {
  id: string
  productId: number
  name: string
  size: string
  sugar: string
  ice: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// 定义产品类型
export interface Product {
  id: number
  categoryId: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  isHot?: boolean
  isRecommended?: boolean
  tags: string[]
  sizes: Array<{ name: string; price: number }>
}

export const useCartStore = defineStore('cart', () => {
  // 状态
  const cartItems = ref<CartItem[]>([])
  const selectedCategory = ref(1)
  const selectedProduct = ref<Product | null>(null)
  const selectedSize = ref('')
  const selectedSugar = ref('正常糖')
  const selectedIce = ref('正常冰')
  const quantity = ref(1)
  const showCart = ref(false)

  // 计算属性
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.totalPrice, 0)
  })

  const cartItemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const canCheckout = computed(() => {
    return cartTotal.value >= 20
  })

  // 方法
  const addToCart = (product: Product, size: string, sugar: string, ice: string, qty: number) => {
    const cartItem: CartItem = {
      id: `${product.id}-${size}-${sugar}-${ice}`,
      productId: product.id,
      name: product.name,
      size: size,
      sugar: sugar,
      ice: ice,
      quantity: qty,
      unitPrice: product.price + (product.sizes.find((s) => s.name === size)?.price || 0),
      totalPrice: (product.price + (product.sizes.find((s) => s.name === size)?.price || 0)) * qty,
    }

    const existingItem = cartItems.value.find((item) => item.id === cartItem.id)
    if (existingItem) {
      existingItem.quantity += cartItem.quantity
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice
    } else {
      cartItems.value.push(cartItem)
    }
  }

  const removeFromCart = (itemId: string) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    const item = cartItems.value.find((item) => item.id === itemId)
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = newQuantity
        item.totalPrice = item.quantity * item.unitPrice
      }
    }
  }

  const increaseCartQuantity = (itemId: string) => {
    const item = cartItems.value.find((item) => item.id === itemId)
    if (item) {
      item.quantity++
      item.totalPrice = item.quantity * item.unitPrice
    }
  }

  const decreaseCartQuantity = (itemId: string) => {
    const item = cartItems.value.find((item) => item.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
        item.totalPrice = item.quantity * item.unitPrice
      } else {
        removeFromCart(itemId)
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const setSelectedCategory = (categoryId: number) => {
    selectedCategory.value = categoryId
  }

  const setSelectedProduct = (product: Product | null) => {
    selectedProduct.value = product
    if (product) {
      selectedSize.value = product.sizes[0].name
      selectedSugar.value = '正常糖'
      selectedIce.value = '正常冰'
      quantity.value = 1
    }
  }

  const setSelectedSize = (size: string) => {
    selectedSize.value = size
  }

  const setSelectedSugar = (sugar: string) => {
    selectedSugar.value = sugar
  }

  const setSelectedIce = (ice: string) => {
    selectedIce.value = ice
  }

  const setQuantity = (qty: number) => {
    quantity.value = qty
  }

  const toggleCart = () => {
    showCart.value = !showCart.value
  }

  const closeCart = () => {
    showCart.value = false
  }

  return {
    // 状态
    cartItems,
    selectedCategory,
    selectedProduct,
    selectedSize,
    selectedSugar,
    selectedIce,
    quantity,
    showCart,

    // 计算属性
    cartTotal,
    cartItemCount,
    canCheckout,

    // 方法
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    clearCart,
    setSelectedCategory,
    setSelectedProduct,
    setSelectedSize,
    setSelectedSugar,
    setSelectedIce,
    setQuantity,
    toggleCart,
    closeCart,
  }
})
