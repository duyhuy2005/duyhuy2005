// ============================================
// RETURNS MODULE
// ============================================
const Returns = {
  items: window.getFromStorage("returns", []),

  getAll() {
    return this.items
  },

  create(orderId, items, reason) {
    const returnRequest = {
      id: "YC" + Date.now().toString().slice(-8),
      orderId: orderId,
      items: items,
      reason: reason,
      status: "pending",
      statusText: "Chờ xử lý",
      createdAt: new Date().toISOString(),
    }

    this.items.unshift(returnRequest)
    this.save()
    window.showToast("Đã gửi yêu cầu đổi/trả hàng!")

    return returnRequest
  },

  save() {
    window.saveToStorage("returns", this.items)
  },
}

// Render returns list
function renderReturns(container) {
  if (!container) return

  const returns = Returns.getAll()

  if (returns.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px;">
        <h3>Chưa có yêu cầu đổi/trả</h3>
        <p class="text-muted">Bạn chưa có yêu cầu đổi/trả hàng nào</p>
      </div>
    `
    return
  }

  container.innerHTML = returns
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

// Select return reason
function selectReason(element) {
  const options = document.querySelectorAll(".reason-option")
  options.forEach((opt) => opt.classList.remove("active"))
  element.classList.add("active")
  element.querySelector('input[type="radio"]').checked = true
}

// Handle return form submission
function handleReturnSubmit(event) {
  event.preventDefault()

  const orderId = document.getElementById("orderId").value
  const reason = document.querySelector('input[name="reason"]:checked')?.value
  const description = document.getElementById("description").value

  if (!orderId || !reason) {
    window.showToast("Vui lòng điền đầy đủ thông tin!", "error")
    return
  }

  Returns.create(orderId, [], reason + (description ? ": " + description : ""))

  // Reset form
  event.target.reset()
  const options = document.querySelectorAll(".reason-option")
  options.forEach((opt) => opt.classList.remove("active"))

  // Refresh list
  const container = document.getElementById("returns-list")
  renderReturns(container)
}

// Assuming getFromStorage, saveToStorage, and showToast are defined in the global window object
window.getFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : defaultValue
}

window.saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

window.showToast = (message, type = "success") => {
  console.log(`Toast: ${type} - ${message}`)
}
