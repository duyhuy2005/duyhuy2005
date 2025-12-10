// ============================================
// MAIN APPLICATION STATE
// ============================================
const App = {
  // User state
  user: JSON.parse(localStorage.getItem("user")) || null,

  // Cart state
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  // Orders state
  orders: JSON.parse(localStorage.getItem("orders")) || [],

  // Returns state
  returns: JSON.parse(localStorage.getItem("returns")) || [],

  // Sample Products Data
  products: [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      category: "Điện thoại",
      price: 29990000,
      originalPrice: 34990000,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      rating: 4.8,
      reviews: 256,
      discount: 15,
      stock: 50,
      description: "iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch.",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      category: "Điện thoại",
      price: 27990000,
      originalPrice: 31990000,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
      rating: 4.7,
      reviews: 189,
      discount: 12,
      stock: 35,
      description: "Samsung Galaxy S24 Ultra với bút S Pen, camera 200MP, màn hình Dynamic AMOLED 2X.",
    },
    {
      id: 3,
      name: 'MacBook Pro 14" M3 Pro',
      category: "Laptop",
      price: 49990000,
      originalPrice: 54990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 4.9,
      reviews: 124,
      discount: 9,
      stock: 20,
      description: "MacBook Pro 14 inch với chip M3 Pro, 18GB RAM, 512GB SSD, màn hình Liquid Retina XDR.",
    },
    {
      id: 4,
      name: 'iPad Pro 12.9" M2',
      category: "Máy tính bảng",
      price: 28990000,
      originalPrice: 32990000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      rating: 4.8,
      reviews: 98,
      discount: 12,
      stock: 25,
      description: "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil 2.",
    },
    {
      id: 5,
      name: "AirPods Pro 2",
      category: "Phụ kiện",
      price: 5990000,
      originalPrice: 6990000,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
      rating: 4.7,
      reviews: 312,
      discount: 14,
      stock: 100,
      description: "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, âm thanh không gian.",
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      category: "Đồng hồ",
      price: 10990000,
      originalPrice: 12990000,
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      rating: 4.6,
      reviews: 167,
      discount: 15,
      stock: 45,
      description: "Apple Watch Series 9 với chip S9 SiP, màn hình Always-On Retina, theo dõi sức khỏe.",
    },
    {
      id: 7,
      name: "Sony WH-1000XM5",
      category: "Phụ kiện",
      price: 7490000,
      originalPrice: 8990000,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
      rating: 4.8,
      reviews: 203,
      discount: 17,
      stock: 60,
      description: "Tai nghe chống ồn Sony WH-1000XM5 với âm thanh Hi-Res, pin 30 giờ.",
    },
    {
      id: 8,
      name: "Dell XPS 15",
      category: "Laptop",
      price: 42990000,
      originalPrice: 47990000,
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
      rating: 4.5,
      reviews: 87,
      discount: 10,
      stock: 15,
      description: "Dell XPS 15 với Intel Core i7 Gen 13, 16GB RAM, 512GB SSD, màn hình OLED 3.5K.",
    },
  ],

  // Categories
  categories: [
    { id: 1, name: "Điện thoại", icon: "📱" },
    { id: 2, name: "Laptop", icon: "💻" },
    { id: 3, name: "Máy tính bảng", icon: "📲" },
    { id: 4, name: "Đồng hồ", icon: "⌚" },
    { id: 5, name: "Phụ kiện", icon: "🎧" },
    { id: 6, name: "Tivi", icon: "📺" },
  ],
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container") || createToastContainer()
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <span>${type === "success" ? "✓" : "✕"}</span>
    <span>${message}</span>
  `
  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

function createToastContainer() {
  const container = document.createElement("div")
  container.id = "toast-container"
  container.className = "toast-container"
  document.body.appendChild(container)
  return container
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(productId, quantity = 1) {
  const product = App.products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = App.cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    App.cart.push({
      id: generateId(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    })
  }

  saveToStorage("cart", App.cart)
  updateCartCount()
  showToast("Đã thêm vào giỏ hàng!")
}

function removeFromCart(itemId) {
  App.cart = App.cart.filter((item) => item.id !== itemId)
  saveToStorage("cart", App.cart)
  updateCartCount()
  renderCart()
  showToast("Đã xóa khỏi giỏ hàng")
}

function updateCartQuantity(itemId, quantity) {
  const item = App.cart.find((i) => i.id === itemId)
  if (item) {
    item.quantity = Math.max(1, quantity)
    saveToStorage("cart", App.cart)
    renderCart()
  }
}

function getCartTotal() {
  return App.cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

function getCartCount() {
  return App.cart.reduce((count, item) => count + item.quantity, 0)
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")
  const count = getCartCount()
  cartCountElements.forEach((el) => {
    el.textContent = count
    el.style.display = count > 0 ? "flex" : "none"
  })
}

function clearCart() {
  App.cart = []
  saveToStorage("cart", App.cart)
  updateCartCount()
}

// ============================================
// AUTH FUNCTIONS
// ============================================
function login(email, password) {
  // Simulate login
  if (email && password) {
    const user = {
      id: generateId(),
      email: email,
      name: email.split("@")[0],
      phone: "",
      address: "",
    }
    App.user = user
    saveToStorage("user", user)
    showToast("Đăng nhập thành công!")
    window.location.href = "index.html"
    return true
  }
  showToast("Email hoặc mật khẩu không đúng!", "error")
  return false
}

function register(name, email, password) {
  if (name && email && password) {
    const user = {
      id: generateId(),
      email: email,
      name: name,
      phone: "",
      address: "",
    }
    App.user = user
    saveToStorage("user", user)
    showToast("Đăng ký thành công!")
    window.location.href = "index.html"
    return true
  }
  showToast("Vui lòng điền đầy đủ thông tin!", "error")
  return false
}

function logout() {
  App.user = null
  localStorage.removeItem("user")
  showToast("Đã đăng xuất!")
  window.location.href = "index.html"
}

function isLoggedIn() {
  return App.user !== null
}

// ============================================
// ORDER FUNCTIONS
// ============================================
function createOrder(shippingInfo, paymentMethod) {
  if (App.cart.length === 0) {
    showToast("Giỏ hàng trống!", "error")
    return null
  }

  const order = {
    id: "DH" + Date.now().toString().slice(-8),
    items: [...App.cart],
    total: getCartTotal(),
    shippingFee: 30000,
    shippingInfo: shippingInfo,
    paymentMethod: paymentMethod,
    status: "pending",
    statusText: "Chờ xác nhận",
    createdAt: new Date().toISOString(),
    timeline: [
      {
        status: "Đặt hàng thành công",
        time: new Date().toLocaleString("vi-VN"),
        completed: true,
      },
      {
        status: "Đang xử lý",
        time: "",
        completed: false,
      },
      {
        status: "Đang giao hàng",
        time: "",
        completed: false,
      },
      {
        status: "Đã giao hàng",
        time: "",
        completed: false,
      },
    ],
  }

  App.orders.unshift(order)
  saveToStorage("orders", App.orders)
  clearCart()

  return order
}

function getOrders() {
  return App.orders
}

function getOrderById(orderId) {
  return App.orders.find((o) => o.id === orderId)
}

// ============================================
// RETURN FUNCTIONS
// ============================================
function createReturn(orderId, items, reason) {
  const returnRequest = {
    id: "YC" + Date.now().toString().slice(-8),
    orderId: orderId,
    items: items,
    reason: reason,
    status: "pending",
    statusText: "Chờ xử lý",
    createdAt: new Date().toISOString(),
  }

  App.returns.unshift(returnRequest)
  saveToStorage("returns", App.returns)
  showToast("Đã gửi yêu cầu đổi/trả hàng!")

  return returnRequest
}

function getReturns() {
  return App.returns
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderProducts(container, products = App.products) {
  if (!container) return

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ""}
        <button class="product-wishlist" onclick="event.stopPropagation(); addToWishlist(${product.id})">
          ♡
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ""}
        </div>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary btn-block" onclick="event.stopPropagation(); addToCart(${product.id})">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

function renderCategories(container) {
  if (!container) return

  container.innerHTML = App.categories
    .map(
      (category) => `
    <div class="category-card" onclick="window.location.href='products.html?category=${encodeURIComponent(category.name)}'">
      <div class="icon">${category.icon}</div>
      <h3>${category.name}</h3>
    </div>
  `,
    )
    .join("")
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartSummary = document.getElementById("cart-summary")

  if (!cartItemsContainer) return

  if (App.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <a href="products.html" class="btn btn-primary">Tiếp tục mua sắm</a>
      </div>
    `
    if (cartSummary) cartSummary.style.display = "none"
    return
  }

  if (cartSummary) cartSummary.style.display = "block"

  cartItemsContainer.innerHTML = `
    <div class="cart-header">Giỏ hàng của bạn (${getCartCount()} sản phẩm)</div>
    ${App.cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="cart-item-variant">Màu: Đen | Size: Mặc định</p>
          <p class="cart-item-price">${formatCurrency(item.price)}</p>
          <div class="cart-item-actions">
            <div class="quantity-input">
              <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <input type="number" value="${item.quantity}" min="1" readonly>
              <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Xóa</button>
          </div>
        </div>
      </div>
    `,
      )
      .join("")}
  `

  // Update summary
  const subtotal = getCartTotal()
  const shipping = 30000
  const total = subtotal + shipping

  const summaryContent = document.getElementById("summary-content")
  if (summaryContent) {
    summaryContent.innerHTML = `
      <div class="summary-row">
        <span>Tạm tính</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Phí vận chuyển</span>
        <span>${formatCurrency(shipping)}</span>
      </div>
      <div class="coupon-input">
        <input type="text" placeholder="Nhập mã giảm giá">
        <button class="btn btn-outline">Áp dụng</button>
      </div>
      <div class="summary-row total">
        <span>Tổng cộng</span>
        <span class="amount">${formatCurrency(total)}</span>
      </div>
      <a href="checkout.html" class="btn btn-primary btn-block btn-lg mt-3">Tiến hành đặt hàng</a>
      <a href="products.html" class="btn btn-outline btn-block mt-2">Tiếp tục mua sắm</a>
    `
  }
}

function renderOrders(container, status = "all") {
  if (!container) return

  let orders = App.orders
  if (status !== "all") {
    orders = orders.filter((o) => o.status === status)
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Chưa có đơn hàng</h2>
        <p>Bạn chưa có đơn hàng nào</p>
        <a href="products.html" class="btn btn-primary">Mua sắm ngay</a>
      </div>
    `
    return
  }

  container.innerHTML = orders
    .map(
      (order) => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <span class="order-id">${order.id}</span>
          <span class="order-date"> - ${new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
        <span class="badge ${getStatusBadgeClass(order.status)}">${order.statusText}</span>
      </div>
      <div class="order-card-body">
        <div class="order-products">
          ${order.items
            .slice(0, 2)
            .map(
              (item) => `
            <div class="order-product">
              <div class="order-product-image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="order-product-info">
                <h4>${item.name}</h4>
                <p>Số lượng: ${item.quantity}</p>
              </div>
              <div class="order-item-price">${formatCurrency(item.price * item.quantity)}</div>
            </div>
          `,
            )
            .join("")}
          ${order.items.length > 2 ? `<p class="text-muted">và ${order.items.length - 2} sản phẩm khác...</p>` : ""}
        </div>
        
        <div class="order-timeline">
          <div class="timeline">
            ${order.timeline
              .map(
                (step, index) => `
              <div class="timeline-item ${step.completed ? "completed" : ""} ${index === order.timeline.findIndex((s) => !s.completed) - 1 ? "current" : ""}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>${step.status}</h4>
                  <p>${step.time || "Đang chờ"}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="order-card-footer">
        <div class="order-total">Tổng tiền: <span>${formatCurrency(order.total + order.shippingFee)}</span></div>
        <div>
          <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${order.id}')">Chi tiết</button>
          ${order.status === "delivered" ? `<button class="btn btn-primary btn-sm" onclick="window.location.href='returns.html?orderId=${order.id}'">Đổi/Trả hàng</button>` : ""}
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function getStatusBadgeClass(status) {
  const classes = {
    pending: "badge-warning",
    processing: "badge-info",
    shipping: "badge-info",
    delivered: "badge-success",
    cancelled: "badge-danger",
  }
  return classes[status] || "badge-info"
}

function renderReturns(container) {
  if (!container) return

  if (App.returns.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px;">
        <h3>Chưa có yêu cầu đổi/trả</h3>
        <p class="text-muted">Bạn chưa có yêu cầu đổi/trả hàng nào</p>
      </div>
    `
    return
  }

  container.innerHTML = App.returns
    .map(
      (ret) => `
    <div class="return-card">
      <div class="return-card-header">
        <div>
          <strong>${ret.id}</strong>
          <span class="text-muted"> - Đơn hàng: ${ret.orderId}</span>
        </div>
        <span class="badge ${ret.status === "pending" ? "badge-warning" : ret.status === "approved" ? "badge-success" : "badge-danger"}">${ret.statusText}</span>
      </div>
      <p><strong>Lý do:</strong> ${ret.reason}</p>
      <p class="text-muted">Ngày tạo: ${new Date(ret.createdAt).toLocaleDateString("vi-VN")}</p>
    </div>
  `,
    )
    .join("")
}

function renderCheckoutItems() {
  const container = document.getElementById("checkout-items")
  if (!container) return

  container.innerHTML = App.cart
    .map(
      (item) => `
    <div class="order-item">
      <div class="order-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="order-item-info">
        <h4>${item.name}</h4>
        <p>Số lượng: ${item.quantity}</p>
      </div>
      <div class="order-item-price">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `,
    )
    .join("")

  // Update totals
  const subtotal = getCartTotal()
  const shipping = 30000
  const total = subtotal + shipping

  document.getElementById("checkout-subtotal").textContent = formatCurrency(subtotal)
  document.getElementById("checkout-shipping").textContent = formatCurrency(shipping)
  document.getElementById("checkout-total").textContent = formatCurrency(total)
}

// ============================================
// HEADER UPDATE
// ============================================
function updateHeader() {
  const userActions = document.getElementById("user-actions")
  if (!userActions) return

  if (isLoggedIn()) {
    userActions.innerHTML = `
      <a href="orders.html">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Đơn hàng
      </a>
      <a href="#" onclick="logout()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        ${App.user.name}
      </a>
    `
  } else {
    userActions.innerHTML = `
      <a href="login.html">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Đăng nhập
      </a>
    `
  }
}

// ============================================
// PAGE SPECIFIC FUNCTIONS
// ============================================
function initHomePage() {
  renderCategories(document.getElementById("categories-grid"))
  renderProducts(document.getElementById("featured-products"), App.products.slice(0, 4))
  renderProducts(document.getElementById("new-products"), App.products.slice(4, 8))
}

function initProductsPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")

  let filteredProducts = App.products
  if (category) {
    filteredProducts = App.products.filter((p) => p.category === category)
    document.getElementById("page-title").textContent = category
  }

  renderProducts(document.getElementById("products-grid"), filteredProducts)
  document.getElementById("results-count").textContent = `Hiển thị ${filteredProducts.length} sản phẩm`
}

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = Number.parseInt(urlParams.get("id"))
  const product = App.products.find((p) => p.id === productId)

  if (!product) {
    window.location.href = "products.html"
    return
  }

  document.getElementById("product-name").textContent = product.name
  document.getElementById("product-category").textContent = product.category
  document.getElementById("product-rating").innerHTML = `
    <span class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</span>
    <span>${product.rating}</span>
    <span class="text-muted">(${product.reviews} đánh giá)</span>
  `
  document.getElementById("product-price").innerHTML = `
    <span class="current">${formatCurrency(product.price)}</span>
    ${product.originalPrice ? `<span class="original">${formatCurrency(product.originalPrice)}</span>` : ""}
    ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ""}
  `
  document.getElementById("product-description").textContent = product.description
  document.getElementById("main-image").src = product.image

  document.getElementById("add-to-cart-btn").onclick = () => {
    const qty = Number.parseInt(document.getElementById("quantity-input").value) || 1
    addToCart(product.id, qty)
  }
}

function initCartPage() {
  renderCart()
}

function initCheckoutPage() {
  if (App.cart.length === 0) {
    window.location.href = "cart.html"
    return
  }
  renderCheckoutItems()

  document.getElementById("checkout-form").onsubmit = (e) => {
    e.preventDefault()

    const shippingInfo = {
      name: document.getElementById("fullname").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      note: document.getElementById("note").value,
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value

    const order = createOrder(shippingInfo, paymentMethod)
    if (order) {
      showToast("Đặt hàng thành công!")
      setTimeout(() => {
        window.location.href = "orders.html"
      }, 1500)
    }
  }
}

function initOrdersPage() {
  renderOrders(document.getElementById("orders-list"))

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      renderOrders(document.getElementById("orders-list"), btn.dataset.status)
    }
  })
}

function initReturnsPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const orderId = urlParams.get("orderId")

  if (orderId) {
    const order = getOrderById(orderId)
    if (order) {
      document.getElementById("order-select").value = orderId
      renderOrderItemsForReturn(order)
    }
  }

  renderReturns(document.getElementById("returns-list"))

  document.getElementById("return-form").onsubmit = (e) => {
    e.preventDefault()
    const selectedOrder = document.getElementById("order-select").value
    const reason = document.getElementById("return-reason").value

    if (!selectedOrder || !reason) {
      showToast("Vui lòng điền đầy đủ thông tin!", "error")
      return
    }

    createReturn(selectedOrder, [], reason)
    document.getElementById("return-form").reset()
    renderReturns(document.getElementById("returns-list"))
  }
}

function renderOrderItemsForReturn(order) {
  const container = document.getElementById("return-items")
  if (!container) return

  container.innerHTML = order.items
    .map(
      (item) => `
    <label class="return-product-select">
      <input type="checkbox" name="return-item" value="${item.id}">
      <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      <div>
        <strong>${item.name}</strong>
        <p class="text-muted">Số lượng: ${item.quantity}</p>
      </div>
    </label>
  `,
    )
    .join("")
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  updateHeader()

  // Initialize based on page
  const path = window.location.pathname

  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    initHomePage()
  } else if (path.includes("products.html")) {
    initProductsPage()
  } else if (path.includes("product-detail.html")) {
    initProductDetailPage()
  } else if (path.includes("cart.html")) {
    initCartPage()
  } else if (path.includes("checkout.html")) {
    initCheckoutPage()
  } else if (path.includes("orders.html")) {
    initOrdersPage()
  } else if (path.includes("returns.html")) {
    initReturnsPage()
  }
})
