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
      <a href="orders.html" style="display: flex; flex-direction: column; align-items: center; font-size: 12px; text-decoration: none; color: var(--foreground);">
        <img src="https://via.placeholder.com/24x24/4A90E2/FFFFFF?text=📦" alt="Đơn hàng" style="width: 24px; height: 24px; margin-bottom: 4px;">
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
      <a href="login.html" style="display: flex; flex-direction: column; align-items: center; font-size: 12px; text-decoration: none; color: var(--foreground);">
        <img src="images/user-icon.png" alt="Đăng nhập" style="width: 24px; height: 24px; margin-bottom: 4px;">
        Đăng nhập
      </a>
    `
  }

  // Update cart count
  Cart.updateCount()
}

// Initialize search functionality
function initSearch() {
  // Find all search boxes on the page
  const searchBoxes = document.querySelectorAll(".search-box")
  
  searchBoxes.forEach((searchBox) => {
    const searchInput = searchBox.querySelector("input[type='text']")
    const searchButton = searchBox.querySelector("button")
    
    if (!searchInput) return
    
    // Handle search button click
    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault()
        handleSearch(searchInput.value.trim())
      })
    }
    
    // Handle Enter key press
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSearch(searchInput.value.trim())
      }
    })
  })
}

// Handle search function
function handleSearch(query) {
  if (!query || query.length === 0) {
    // If empty, just go to products page
    window.location.href = "products.html"
    return
  }
  
  // Encode query and redirect to products page
  const encodedQuery = encodeURIComponent(query)
  window.location.href = `products.html?search=${encodedQuery}`
}

// Make handleSearch globally available
window.handleSearch = handleSearch

// Initialize header and search on page load
document.addEventListener("DOMContentLoaded", () => {
  updateHeader()
  initSearch()
})
