// ============================================
// HEADER MODULE
// ============================================

// Declare Auth and Cart variables
const Auth = {
  isLoggedIn: () => {
    // Implementation here
  },
  getUser: () => {
    // Implementation here
  },
}

const Cart = {
  updateCount: () => {
    // Implementation here
  },
}

// Update header based on auth state
function updateHeader() {
  const userActions = document.getElementById("user-actions")
  if (!userActions) return

  if (Auth.isLoggedIn()) {
    const user = Auth.getUser()
    userActions.innerHTML = `
      <a href="orders.html">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Đơn hàng
      </a>
      <div class="user-dropdown">
        <a href="#" onclick="event.preventDefault()" style="display: flex; flex-direction: column; align-items: center; font-size: 12px; text-decoration: none; color: var(--foreground);">
          <img src="images/user-icon.png" alt="User" style="width: 24px; height: 24px; margin-bottom: 4px;">
          ${user.name}
        </a>
        <div class="dropdown-menu">
          <a href="orders.html">Đơn hàng của tôi</a>
          <a href="returns.html">Đổi/Trả hàng</a>
          <a href="#" onclick="logout()">Đăng xuất</a>
        </div>
      </div>
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

  // Update cart count
  Cart.updateCount()
}

// Initialize header on page load
document.addEventListener("DOMContentLoaded", () => {
  updateHeader()
})
