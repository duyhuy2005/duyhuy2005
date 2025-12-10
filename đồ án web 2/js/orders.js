// ============================================
// ORDERS MODULE
// ============================================
const Orders = {
  items: [], // Placeholder for getFromStorage("orders", [])

  getAll() {
    return this.items
  },

  getById(orderId) {
    return this.items.find((o) => o.id === orderId)
  },

  getByStatus(status) {
    if (status === "all") return this.items
    return this.items.filter((o) => o.status === status)
  },

  create(shippingInfo, paymentMethod) {
    const cartItems = [] // Placeholder for Cart.getItems()
    if (cartItems.length === 0) {
      showToast("Giỏ hàng trống!", "error") // Placeholder for showToast
      return null
    }

    const order = {
      id: "DH" + Date.now().toString().slice(-8),
      items: [...cartItems],
      total: 0, // Placeholder for Cart.getTotal()
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

    this.items.unshift(order)
    this.save()
    // Cart.clear(); // Placeholder for Cart.clear()

    return order
  },

  save() {
    // saveToStorage("orders", this.items); // Placeholder for saveToStorage
  },
}

// Get status badge class
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

// Render orders list
function renderOrders(container, status = "all") {
  if (!container) return

  const orders = Orders.getByStatus(status)

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

function viewOrderDetail(orderId) {
  showToast("Chi tiết đơn hàng: " + orderId) // Placeholder for showToast
}

// Filter orders by tab
function filterOrders(status) {
  const tabs = document.querySelectorAll(".tab-btn")
  tabs.forEach((tab) => tab.classList.remove("active"))
  event.target.classList.add("active")

  const container = document.getElementById("orders-list")
  renderOrders(container, status)
}

// Placeholder functions for undeclared variables
function getFromStorage(key, defaultValue) {
  // Implementation for getFromStorage
  return defaultValue
}

const Cart = {
  getItems() {
    // Implementation for Cart.getItems
    return []
  },
  getTotal() {
    // Implementation for Cart.getTotal
    return 0
  },
  clear() {
    // Implementation for Cart.clear
  },
}

function showToast(message, type) {
  // Implementation for showToast
  console.log(message, type)
}

function formatCurrency(amount) {
  // Implementation for formatCurrency
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}
