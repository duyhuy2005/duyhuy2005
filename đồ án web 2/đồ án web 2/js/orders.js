// ============================================
// ORDERS MODULE
// ============================================
// Use utility functions from utils.js (loaded before this file)
// Use Cart from cart.js (loaded before this file)

const Orders = {
  items: getFromStorage("orders", []),

  // Initialize and normalize orders from localStorage
  init() {
    // Load orders and normalize them to standard format
    const rawOrders = getFromStorage("orders", [])
    this.items = rawOrders.map(order => this.normalizeOrder(order))
    this.save()
  },

  // Normalize order to standard format (handle both checkout.js format and orders.js format)
  normalizeOrder(order) {
    // If already normalized, return as is
    if (order.statusText && order.timeline) {
      return order
    }

    // Normalize from checkout.js format
    const normalized = {
      id: order.id || "DH" + Date.now().toString().slice(-8),
      items: order.items || [],
      total: order.total || (order.subtotal || 0) + (order.shipping || 0) - (order.discount || 0),
      shippingFee: order.shippingFee || order.shipping || (order.subtotal >= 500000 ? 0 : 30000),
      subtotal: order.subtotal || order.total || 0,
      discount: order.discount || 0,
      shippingInfo: order.shippingInfo || {},
      paymentMethod: order.paymentMethod || "cod",
      status: order.status || "pending",
      statusText: this.getStatusText(order.status || "pending"),
      createdAt: order.createdAt || order.date || new Date().toISOString(),
      timeline: order.timeline || this.createTimeline(order.status || "pending"),
    }

    return normalized
  },

  // Get status text from status
  getStatusText(status) {
    const statusMap = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    }
    return statusMap[status] || "Chờ xác nhận"
  },

  // Create timeline based on status
  createTimeline(status) {
    const now = new Date().toLocaleString("vi-VN")
    const timeline = [
      {
        status: "Đặt hàng thành công",
        time: now,
        completed: true,
      },
      {
        status: "Đang xử lý",
        time: ["confirmed", "processing", "shipping", "delivered"].includes(status) ? now : "",
        completed: ["confirmed", "processing", "shipping", "delivered"].includes(status),
      },
      {
        status: "Đang giao hàng",
        time: ["shipping", "delivered"].includes(status) ? now : "",
        completed: ["shipping", "delivered"].includes(status),
      },
      {
        status: "Đã giao hàng",
        time: status === "delivered" ? now : "",
        completed: status === "delivered",
      },
    ]
    return timeline
  },

  getAll() {
    return this.items
  },

  getById(orderId) {
    return this.items.find((o) => o.id === orderId)
  },

  getByStatus(status) {
    if (status === "all") return this.items
    // Map status filter to actual status values
    const statusMap = {
      pending: "pending",
      confirmed: "confirmed",
      shipping: "shipping",
      delivered: "delivered",
      cancelled: "cancelled",
    }
    const actualStatus = statusMap[status] || status
    return this.items.filter((o) => o.status === actualStatus)
  },

  create(shippingInfo, paymentMethod) {
    const cartItems = Cart.getItems()
    if (cartItems.length === 0) {
      showToast("Giỏ hàng trống!", "error")
      return null
    }

    const subtotal = Cart.getTotal()
    const shipping = subtotal >= 500000 ? 0 : 30000
    const discount = Cart.discountAmount || 0

    const order = {
      id: "DH" + Date.now().toString().slice(-8),
      items: [...cartItems],
      subtotal: subtotal,
      discount: discount,
      shippingFee: shipping,
      total: subtotal + shipping - discount,
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

    return order
  },

  save() {
    saveToStorage("orders", this.items)
  },
}

// Initialize orders on load
Orders.init()

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

  // Re-initialize to ensure latest orders are loaded
  Orders.init()
  const orders = Orders.getByStatus(status)

  // Show empty state if no orders
  const emptyState = document.getElementById("empty-orders")
  if (emptyState) {
    emptyState.style.display = orders.length === 0 ? "block" : "none"
  }

  if (orders.length === 0) {
    container.innerHTML = ""
    return
  }

  container.innerHTML = orders
    .map(
      (order) => {
        // Ensure order is normalized
        const normalizedOrder = Orders.normalizeOrder(order)
        const orderDate = normalizedOrder.createdAt 
          ? new Date(normalizedOrder.createdAt).toLocaleDateString("vi-VN")
          : "N/A"
        
        // Calculate total
        const orderTotal = normalizedOrder.total || 
          ((normalizedOrder.subtotal || 0) + (normalizedOrder.shippingFee || normalizedOrder.shipping || 0) - (normalizedOrder.discount || 0))

        return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <span class="order-id">${normalizedOrder.id}</span>
          <span class="order-date"> - ${orderDate}</span>
        </div>
        <span class="badge ${getStatusBadgeClass(normalizedOrder.status)}">${normalizedOrder.statusText || "Chờ xác nhận"}</span>
      </div>
      <div class="order-card-body">
        <div class="order-products">
          ${(normalizedOrder.items || [])
            .slice(0, 2)
            .map(
              (item) => `
            <div class="order-product">
              <div class="order-product-image">
                <img src="${item.image || ''}" alt="${item.name || ''}" onerror="this.src='https://via.placeholder.com/100'">
              </div>
              <div class="order-product-info">
                <h4>${item.name || 'Sản phẩm'}</h4>
                <p>Số lượng: ${item.quantity || 1}</p>
              </div>
              <div class="order-item-price">${formatCurrency((item.price || 0) * (item.quantity || 1))}</div>
            </div>
          `,
            )
            .join("")}
          ${(normalizedOrder.items || []).length > 2 ? `<p class="text-muted">và ${(normalizedOrder.items || []).length - 2} sản phẩm khác...</p>` : ""}
        </div>
        
        ${normalizedOrder.timeline ? `
        <div class="order-timeline">
          <div class="timeline">
            ${normalizedOrder.timeline
              .map(
                (step, index) => {
                  const currentIndex = normalizedOrder.timeline.findIndex((s) => !s.completed)
                  return `
              <div class="timeline-item ${step.completed ? "completed" : ""} ${index === currentIndex - 1 ? "current" : ""}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>${step.status}</h4>
                  <p>${step.time || "Đang chờ"}</p>
                </div>
              </div>
            `
                },
              )
              .join("")}
          </div>
        </div>
        ` : ''}
      </div>
      <div class="order-card-footer">
        <div class="order-total">Tổng tiền: <span>${formatCurrency(orderTotal)}</span></div>
        <div>
          <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${normalizedOrder.id}')">Chi tiết</button>
          ${normalizedOrder.status === "delivered" ? `<button class="btn btn-primary btn-sm" onclick="window.location.href='returns.html?orderId=${normalizedOrder.id}'">Đổi/Trả hàng</button>` : ""}
        </div>
      </div>
    </div>
  `
      },
    )
    .join("")
}

function viewOrderDetail(orderId) {
  const order = Orders.getById(orderId)
  if (!order) {
    showToast("Không tìm thấy đơn hàng!", "error")
    return
  }

  // Show order detail in modal
  const modal = document.getElementById("order-modal")
  const modalContent = document.getElementById("order-detail-content")
  
  if (modal && modalContent) {
    const normalizedOrder = Orders.normalizeOrder(order)
    const orderTotal = normalizedOrder.total || 
      ((normalizedOrder.subtotal || 0) + (normalizedOrder.shippingFee || normalizedOrder.shipping || 0) - (normalizedOrder.discount || 0))
    
    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 16px;">Thông tin đơn hàng</h3>
        <div style="display: grid; gap: 12px;">
          <div><strong>Mã đơn hàng:</strong> ${normalizedOrder.id}</div>
          <div><strong>Ngày đặt:</strong> ${normalizedOrder.createdAt ? new Date(normalizedOrder.createdAt).toLocaleString("vi-VN") : "N/A"}</div>
          <div><strong>Trạng thái:</strong> <span class="badge ${getStatusBadgeClass(normalizedOrder.status)}">${normalizedOrder.statusText}</span></div>
          <div><strong>Phương thức thanh toán:</strong> ${
            normalizedOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" :
            normalizedOrder.paymentMethod === "bank" ? "Chuyển khoản ngân hàng" :
            normalizedOrder.paymentMethod === "momo" ? "Ví MoMo" :
            normalizedOrder.paymentMethod === "vnpay" ? "VNPay" :
            normalizedOrder.paymentMethod || "N/A"
          }</div>
        </div>
      </div>
      
      ${normalizedOrder.shippingInfo ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 16px;">Thông tin giao hàng</h3>
        <div style="display: grid; gap: 12px;">
          <div><strong>Họ tên:</strong> ${normalizedOrder.shippingInfo.fullname || normalizedOrder.shippingInfo.name || "N/A"}</div>
          <div><strong>Số điện thoại:</strong> ${normalizedOrder.shippingInfo.phone || "N/A"}</div>
          <div><strong>Email:</strong> ${normalizedOrder.shippingInfo.email || "N/A"}</div>
          <div><strong>Địa chỉ:</strong> ${normalizedOrder.shippingInfo.address || "N/A"}${
            normalizedOrder.shippingInfo.district ? `, ${normalizedOrder.shippingInfo.district}` : ""
          }${
            normalizedOrder.shippingInfo.city ? `, ${normalizedOrder.shippingInfo.city}` : ""
          }</div>
          ${normalizedOrder.shippingInfo.note ? `<div><strong>Ghi chú:</strong> ${normalizedOrder.shippingInfo.note}</div>` : ""}
        </div>
      </div>
      ` : ''}
      
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 16px;">Sản phẩm</h3>
        <div style="display: grid; gap: 12px;">
          ${(normalizedOrder.items || []).map(item => `
            <div style="display: flex; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <img src="${item.image || ''}" alt="${item.name || ''}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/80'">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">${item.name || 'Sản phẩm'}</div>
                <div style="font-size: 14px; color: #6b7280;">Số lượng: ${item.quantity || 1}</div>
                <div style="font-weight: 600; color: #0284c7; margin-top: 8px;">${formatCurrency((item.price || 0) * (item.quantity || 1))}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tạm tính:</span>
          <span>${formatCurrency(normalizedOrder.subtotal || normalizedOrder.total || 0)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Phí vận chuyển:</span>
          <span>${formatCurrency(normalizedOrder.shippingFee || normalizedOrder.shipping || 0)}</span>
        </div>
        ${(normalizedOrder.discount || 0) > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #22c55e;">
          <span>Giảm giá:</span>
          <span>-${formatCurrency(normalizedOrder.discount || 0)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <span>Tổng cộng:</span>
          <span style="color: #0284c7;">${formatCurrency(orderTotal)}</span>
        </div>
      </div>
    `
    
    modal.style.display = "block"
  } else {
    showToast(`Chi tiết đơn hàng: ${orderId}`)
  }
}

function closeModal() {
  const modal = document.getElementById("order-modal")
  if (modal) {
    modal.style.display = "none"
  }
}

// Filter orders by tab
function filterOrders(status, element) {
  const tabs = document.querySelectorAll(".tab-btn")
  tabs.forEach((tab) => tab.classList.remove("active"))
  if (element) {
    element.classList.add("active")
  }

  const container = document.getElementById("orders-list")
  renderOrders(container, status)
}

// Make functions globally available
window.viewOrderDetail = viewOrderDetail
window.closeModal = closeModal
window.filterOrders = filterOrders
