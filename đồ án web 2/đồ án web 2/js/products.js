// ============================================
// PRODUCTS MODULE
// ============================================

// Use AppData from data.js (loaded before this file)
// Use formatCurrency from utils.js (loaded before this file)
// Use getUrlParam from utils.js (loaded before this file)
// Use showToast from utils.js (loaded before this file)

// Render products grid
function renderProducts(container, products = AppData.products) {
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

// Render categories grid
function renderCategories(container) {
  if (!container) return

  container.innerHTML = AppData.categories
    .map(
      (category) => {
        // Use image if available, otherwise use icon as fallback
        const imageUrl = category.image || 'https://via.placeholder.com/150';
        // Handle local paths (public/) and full URLs
        const finalImageUrl = imageUrl.startsWith('public/') ? imageUrl : imageUrl;
        return `
    <div class="category-card" onclick="window.location.href='products.html?category=${encodeURIComponent(category.name)}'">
      <div class="category-image">
        <img src="${finalImageUrl}" 
             alt="${category.name}" 
             loading="lazy"
             onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div class=\\'category-icon\\' style=\\'width: 64px; height: 64px; background-color: var(--primary-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;\\'>${category.icon || '📦'}</div>';">
      </div>
      <h3>${category.name}</h3>
    </div>
  `
      }
    )
    .join("")
}

// Render product detail
function renderProductDetail(container) {
  if (!container) return

  const productId = getUrlParam("id")
  const product = AppData.getProductById(productId)

  if (!product) {
    container.innerHTML = `
      <div class="text-center" style="padding: 60px;">
        <h2>Không tìm thấy sản phẩm</h2>
        <a href="products.html" class="btn btn-primary mt-3">Quay lại cửa hàng</a>
      </div>
    `
    return
  }

  container.innerHTML = `
    <div class="product-gallery">
      <div class="main-image">
        <img src="${product.image}" alt="${product.name}" id="main-product-image">
      </div>
      <div class="thumbnail-list">
        <div class="thumbnail active">
          <img src="${product.image}" alt="${product.name}" onclick="changeMainImage(this)">
        </div>
        <div class="thumbnail">
          <img src="${product.image}" alt="${product.name}" onclick="changeMainImage(this)">
        </div>
        <div class="thumbnail">
          <img src="${product.image}" alt="${product.name}" onclick="changeMainImage(this)">
        </div>
      </div>
    </div>

    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <div class="product-meta">
        <div class="product-rating">
          <span class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</span>
          <span>${product.rating}</span>
        </div>
        <span class="text-muted">${product.reviews} đánh giá</span>
        <span class="text-muted">Đã bán: ${Math.floor(Math.random() * 500 + 100)}</span>
      </div>

      <div class="product-detail-price">
        <span class="current">${formatCurrency(product.price)}</span>
        ${product.originalPrice ? `<span class="original">${formatCurrency(product.originalPrice)}</span>` : ""}
        ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ""}
      </div>

      <div class="product-options">
        <div class="option-group">
          <label>Màu sắc:</label>
          <div class="option-buttons">
            <button class="option-btn active" onclick="selectOption(this)">Đen</button>
            <button class="option-btn" onclick="selectOption(this)">Trắng</button>
            <button class="option-btn" onclick="selectOption(this)">Xanh</button>
          </div>
        </div>

        <div class="option-group">
          <label>Dung lượng:</label>
          <div class="option-buttons">
            <button class="option-btn active" onclick="selectOption(this)">256GB</button>
            <button class="option-btn" onclick="selectOption(this)">512GB</button>
            <button class="option-btn" onclick="selectOption(this)">1TB</button>
          </div>
        </div>

        <div class="option-group">
          <label>Số lượng:</label>
          <div class="quantity-selector">
            <div class="quantity-input">
              <button onclick="updateDetailQuantity(-1)">-</button>
              <input type="number" value="1" min="1" id="detail-quantity" readonly>
              <button onclick="updateDetailQuantity(1)">+</button>
            </div>
            <span class="text-muted">${product.stock} sản phẩm có sẵn</span>
          </div>
        </div>
      </div>

      <div class="add-to-cart-actions">
        <button class="btn btn-outline btn-lg" onclick="addToCart(${product.id})">
          Thêm vào giỏ
        </button>
        <button class="btn btn-primary btn-lg" onclick="buyNow(${product.id})">
          Mua ngay
        </button>
      </div>

      <div class="product-features">
        <div class="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Bảo hành chính hãng 12 tháng</span>
        </div>
        <div class="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Miễn phí giao hàng toàn quốc</span>
        </div>
        <div class="feature-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Đổi trả trong 30 ngày</span>
        </div>
      </div>

      <div class="product-description mt-4">
        <h3>Mô tả sản phẩm</h3>
        <p class="mt-2">${product.description}</p>
      </div>
    </div>
  `
}

// Change main image
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById("main-product-image")
  if (mainImage) {
    mainImage.src = thumbnail.src
  }

  const thumbnails = document.querySelectorAll(".thumbnail")
  thumbnails.forEach((t) => t.classList.remove("active"))
  thumbnail.parentElement.classList.add("active")
}

// Update detail quantity
function updateDetailQuantity(change) {
  const input = document.getElementById("detail-quantity")
  if (input) {
    const newValue = Math.max(1, Number.parseInt(input.value) + change)
    input.value = newValue
  }
}

// Select option
function selectOption(button) {
  const group = button.closest(".option-buttons")
  group.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("active"))
  button.classList.add("active")
}

// Buy now
function buyNow(productId) {
  const quantity = Number.parseInt(document.getElementById("detail-quantity")?.value || 1)
  Cart.addItem(productId, quantity)
  window.location.href = "checkout.html"
}

// Add to wishlist
function addToWishlist(productId) {
  showToast("Đã thêm vào danh sách yêu thích!")
}

// Filter products by category
function filterProductsByCategory() {
  const category = getUrlParam("category")
  const container = document.getElementById("products-grid")

  if (container) {
    const products = AppData.getProductsByCategory(category)
    renderProducts(container, products)

    // Update results count
    const resultsEl = document.querySelector(".toolbar .results")
    if (resultsEl) {
      resultsEl.textContent = `Hiển thị ${products.length} sản phẩm`
    }

    // Update page title
    const titleEl = document.querySelector(".page-header h1")
    if (titleEl && category) {
      titleEl.textContent = category
    }
  }
}

// Sort products
function sortProducts(sortBy) {
  const container = document.getElementById("products-grid")
  const category = getUrlParam("category")
  const products = [...AppData.getProductsByCategory(category)]

  switch (sortBy) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      products.sort((a, b) => b.price - a.price)
      break
    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      products.sort((a, b) => b.rating - a.rating)
      break
    default:
      break
  }

  renderProducts(container, products)
}

// Search products
function searchProducts(query) {
  const container = document.getElementById("products-grid")
  if (container && query) {
    const products = AppData.searchProducts(query)
    renderProducts(container, products)
  }
}
