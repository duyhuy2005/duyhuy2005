// === DATA DEMO ======================================================

const PRODUCTS = [
  {
    id: 1,
    name: "Áo thun nam Slim Fit",
    category: "thoi-trang",
    price: 80,
    oldPrice: 100,
    rating: 4.5,
    ratingCount: 65,
    image: "https://via.placeholder.com/500x500?text=Ao+thun",
    description: "Áo thun nam chất liệu cotton co giãn, form dáng ôm gọn gàng.",
    variants: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Túi da ô liu",
    category: "tui-balo",
    price: 136,
    oldPrice: 150,
    rating: 4.1,
    ratingCount: 143,
    image: "https://via.placeholder.com/500x500?text=Tui+da",
    description: "Túi da thời trang, phù hợp đi làm và đi chơi, nhiều ngăn tiện lợi.",
    variants: ["Size nhỏ", "Size vừa", "Size lớn"]
  },
  {
    id: 3,
    name: "Váy đỏ Dress",
    category: "thoi-trang",
    price: 219,
    oldPrice: 250,
    rating: 4.4,
    ratingCount: 174,
    image: "https://via.placeholder.com/500x500?text=Vay+do",
    description: "Váy dạ hội màu đỏ nổi bật, tôn dáng, phù hợp dự tiệc.",
    variants: ["S", "M", "L"]
  },
  {
    id: 4,
    name: "Dép da bò",
    category: "giay-dep",
    price: 159,
    oldPrice: 200,
    rating: 4.5,
    ratingCount: 174,
    image: "https://via.placeholder.com/500x500?text=Dep+da",
    description: "Dép da bò êm chân, bền bỉ, đi trong nhà hoặc ngoài phố.",
    variants: ["39", "40", "41", "42"]
  },
  {
    id: 5,
    name: "Áo khoác Varsity",
    category: "thoi-trang",
    price: 120,
    oldPrice: 160,
    rating: 4.7,
    ratingCount: 210,
    image: "https://via.placeholder.com/500x500?text=Varsity",
    description: "Áo khoác varsity phong cách đường phố, phối màu nổi bật.",
    variants: ["M", "L", "XL"]
  },
  {
    id: 6,
    name: "Đồng hồ vàng nam",
    category: "phu-kien",
    price: 340,
    oldPrice: 420,
    rating: 4.8,
    ratingCount: 98,
    image: "https://via.placeholder.com/500x500?text=Watch",
    description: "Đồng hồ kim loại mạ vàng sang trọng, chống nước.",
    variants: ["Dây kim loại", "Dây da"]
  },
  {
    id: 7,
    name: "Giày cao gót trắng",
    category: "giay-dep",
    price: 99,
    oldPrice: 130,
    rating: 4.3,
    ratingCount: 74,
    image: "https://via.placeholder.com/500x500?text=Giay+cao+got",
    description: "Giày cao gót 7cm màu trắng, dễ phối đồ.",
    variants: ["36", "37", "38", "39"]
  },
  {
    id: 8,
    name: "Balo trắng cute",
    category: "tui-balo",
    price: 60,
    oldPrice: 80,
    rating: 4.6,
    ratingCount: 123,
    image: "https://via.placeholder.com/500x500?text=Balo",
    description: "Balo vải canvas in hình dễ thương, phù hợp đi học, đi chơi.",
    variants: ["Size M", "Size L"]
  }
];

const ORDER_STATUS_STEPS = ["Đã tiếp nhận", "Đang giao", "Hoàn thành"];

// === UTIL STORAGE ===================================================

function getStorage(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// === USER / AUTH ====================================================

function getCurrentUser() {
  return getStorage("user", null);
}

// === CART ===========================================================

function getCart() {
  return getStorage("cart", []);
}

function saveCart(cart) {
  setStorage("cart", cart);
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) item.qty += qty;
  else cart.push({ productId, qty });
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.productId !== productId);
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function calcCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach((item) => {
    const p = PRODUCTS.find((x) => x.id === item.productId);
    if (p) subtotal += p.price * item.qty;
  });

  const voucher = getStorage("cartVoucher", null);
  let discount = 0;
  if (voucher && voucher.code === "GIAM10") {
    discount = Math.round(subtotal * 0.1);
  }
  const total = Math.max(0, subtotal - discount);
  return { subtotal, discount, total, voucher };
}

// === ORDERS =========================================================

function getOrders() {
  return getStorage("orders", []);
}

function saveOrders(list) {
  setStorage("orders", list);
}

function createOrder(orderData) {
  const orders = getOrders();
  const id = Date.now();
  const newOrder = {
    id,
    createdAt: new Date().toISOString(),
    statusIndex: 0,
    ...orderData
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

// === RETURNS ========================================================

function getReturns() {
  return getStorage("returns", []);
}

function saveReturns(list) {
  setStorage("returns", list);
}

// === REVIEWS ========================================================

function getReviews(productId) {
  return getStorage("reviews_" + productId, []);
}

function saveReviews(productId, list) {
  setStorage("reviews_" + productId, list);
}

// === HEADER INIT ====================================================

function initHeader() {
  const userArea = document.getElementById("userArea");
  if (userArea) {
    const user = getCurrentUser();
    if (user) {
      userArea.innerHTML = `
        <span class="user-name" style="font-size:13px;color:#e5e7eb">
          Xin chào, ${user.fullName || user.email}
        </span>
        <button class="link-button" id="logoutBtn">Đăng xuất</button>
      `;
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
    } else {
      userArea.innerHTML =
        '<a href="login.html" class="btn-outline">Đăng nhập</a>';
    }
  }

  const page = document.body.dataset.page;
  if (page) {
    document
      .querySelectorAll(".nav a[data-nav]")
      .forEach((a) => a.classList.remove("active"));
    const activeLink = document.querySelector(
      `.nav a[data-nav="${page}"]`
    );
    if (activeLink) activeLink.classList.add("active");
  }
}

// === PAGE: CATEGORY =================================================

function initCategoryPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const state = {
    search: "",
    category: "all",
    minPrice: null,
    maxPrice: null,
    promoOnly: false,
    sort: "default"
  };

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryList = document.getElementById("categoryList");
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const promoOnly = document.getElementById("promoOnly");
  const resetFilter = document.getElementById("resetFilter");
  const sortSelect = document.getElementById("sortSelect");
  const resultCount = document.getElementById("resultCount");

  function render() {
    let list = PRODUCTS.slice();

    if (state.category !== "all") {
      list = list.filter((p) => p.category === state.category);
    }

    if (state.search.trim() !== "") {
      const q = state.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (state.minPrice != null) {
      list = list.filter((p) => p.price >= state.minPrice);
    }
    if (state.maxPrice != null) {
      list = list.filter((p) => p.price <= state.maxPrice);
    }

    if (state.promoOnly) {
      list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }

    if (state.sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sort === "rating-desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    resultCount.textContent = `${list.length} sản phẩm`;

    if (list.length === 0) {
      grid.innerHTML =
        '<p class="empty">Không tìm thấy sản phẩm phù hợp.</p>';
      return;
    }

    grid.innerHTML = list
      .map((p) => {
        const promo =
          p.oldPrice && p.oldPrice > p.price
            ? Math.round(100 - (p.price / p.oldPrice) * 100)
            : 0;
        return `
        <a class="product-card" href="product-detail.html?id=${p.id}">
          ${
            promo
              ? `<span class="card-badge">Giảm ${promo}%</span>`
              : ""
          }
          <div class="card-image">
            <img src="${p.image}" alt="${p.name}">
          </div>
          <div class="card-body">
            <h3 class="card-title">${p.name}</h3>
            <div class="card-rating">
              <span>⭐ ${p.rating.toFixed(1)}</span>
              <span>(${p.ratingCount})</span>
            </div>
            <div class="card-price">
              <span class="price">$${p.price}</span>
              ${
                p.oldPrice
                  ? `<span class="old-price">$${p.oldPrice}</span>`
                  : ""
              }
            </div>
          </div>
        </a>`;
      })
      .join("");
  }

  searchBtn.addEventListener("click", () => {
    state.search = searchInput.value;
    render();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      state.search = searchInput.value;
      render();
    }
  });

  categoryList.addEventListener("click", (e) => {
    if (e.target.matches("li[data-category]")) {
      categoryList
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("active"));
      e.target.classList.add("active");
      state.category = e.target.dataset.category;
      render();
    }
  });

  minPrice.addEventListener("input", () => {
    const v = Number(minPrice.value);
    state.minPrice = Number.isNaN(v) || !minPrice.value ? null : v;
    render();
  });

  maxPrice.addEventListener("input", () => {
    const v = Number(maxPrice.value);
    state.maxPrice = Number.isNaN(v) || !maxPrice.value ? null : v;
    render();
  });

  promoOnly.addEventListener("change", () => {
    state.promoOnly = promoOnly.checked;
    render();
  });

  resetFilter.addEventListener("click", () => {
    state.search = "";
    state.category = "all";
    state.minPrice = null;
    state.maxPrice = null;
    state.promoOnly = false;
    state.sort = "default";

    searchInput.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    promoOnly.checked = false;
    sortSelect.value = "default";
    categoryList
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("active"));
    categoryList
      .querySelector('li[data-category="all"]')
      .classList.add("active");
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  render();
}

// === PAGE: PRODUCT DETAIL ===========================================

function initProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  const nameEl = document.getElementById("productName");
  const imgEl = document.getElementById("productImage");
  const priceEl = document.getElementById("productPrice");
  const oldPriceEl = document.getElementById("productOldPrice");
  const ratingEl = document.getElementById("productRating");
  const descEl = document.getElementById("productDescription");
  const variantSelect = document.getElementById("variantSelect");
  const qtyInput = document.getElementById("detailQty");
  const addBtn = document.getElementById("addToCartBtn");
  const buyBtn = document.getElementById("buyNowBtn");

  nameEl.textContent = product.name;
  imgEl.src = product.image;
  imgEl.alt = product.name;
  priceEl.textContent = "$" + product.price;
  if (product.oldPrice) {
    oldPriceEl.textContent = "$" + product.oldPrice;
  } else {
    oldPriceEl.style.display = "none";
  }
  ratingEl.textContent = `⭐ ${product.rating.toFixed(
    1
  )} (${product.ratingCount} đánh giá)`;
  descEl.textContent = product.description;

  variantSelect.innerHTML = product.variants
    .map((v) => `<option value="${v}">${v}</option>`)
    .join("");

  function handleAdd(goCheckout) {
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    addToCart(product.id, qty);
    alert("Đã thêm vào giỏ hàng!");
    if (goCheckout) {
      window.location.href = "checkout.html";
    }
  }

  addBtn.addEventListener("click", () => handleAdd(false));
  buyBtn.addEventListener("click", () => handleAdd(true));

  // Reviews
  const reviewList = document.getElementById("reviewList");
  const reviewForm = document.getElementById("reviewForm");
  const reviewName = document.getElementById("reviewName");
  const reviewRating = document.getElementById("reviewRating");
  const reviewComment = document.getElementById("reviewComment");

  function renderReviews() {
    const reviews = getReviews(product.id);
    if (!reviews.length) {
      reviewList.innerHTML =
        '<p class="empty">Chưa có đánh giá nào, hãy là người đầu tiên!</p>';
      return;
    }
    reviewList.innerHTML = reviews
      .map(
        (r) => `
      <div class="card">
        <div class="card-header">
          <strong>${r.name}</strong>
          <span>⭐ ${r.rating}</span>
        </div>
        <div class="card-sub">${r.comment}</div>
      </div>
    `
      )
      .join("");
  }

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = reviewName.value.trim() || "Khách";
    const rating = Number(reviewRating.value) || 5;
    const comment = reviewComment.value.trim();
    if (!comment) return;
    const list = getReviews(product.id);
    list.unshift({ name, rating, comment });
    saveReviews(product.id, list);
    reviewComment.value = "";
    renderReviews();
  });

  renderReviews();
}

// === PAGE: CART =====================================================

function initCartPage() {
  const tbody = document.getElementById("cartBody");
  if (!tbody) return;

  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");
  const voucherInput = document.getElementById("voucherCode");
  const voucherBtn = document.getElementById("applyVoucher");
  const emptyMsg = document.getElementById("cartEmptyMsg");

  function render() {
    const cart = getCart();
    if (!cart.length) {
      tbody.innerHTML = "";
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
      tbody.innerHTML = cart
        .map((item) => {
          const p = PRODUCTS.find((x) => x.id === item.productId);
          if (!p) return "";
          return `
        <tr>
          <td>${p.name}</td>
          <td>$${p.price}</td>
          <td>
            <input type="number" min="1" value="${
              item.qty
            }" data-id="${p.id}" class="cart-qty">
          </td>
          <td>$${p.price * item.qty}</td>
          <td><button class="btn-secondary cart-remove" data-id="${
            p.id
          }">Xóa</button></td>
        </tr>`;
        })
        .join("");
    }

    const totals = calcCartTotals();
    subtotalEl.textContent = "$" + totals.subtotal;
    discountEl.textContent = "-$" + totals.discount;
    totalEl.textContent = "$" + totals.total;
    const voucher = totals.voucher;
    voucherInput.value = voucher ? voucher.code : "";
  }

  tbody.addEventListener("input", (e) => {
    if (e.target.classList.contains("cart-qty")) {
      const id = Number(e.target.dataset.id);
      const qty = Math.max(1, Number(e.target.value) || 1);
      updateCartQty(id, qty);
      render();
    }
  });

  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-remove")) {
      const id = Number(e.target.dataset.id);
      removeFromCart(id);
      render();
    }
  });

  voucherBtn.addEventListener("click", () => {
    const code = voucherInput.value.trim().toUpperCase();
    if (!code) {
      localStorage.removeItem("cartVoucher");
      render();
      return;
    }
    if (code === "GIAM10") {
      setStorage("cartVoucher", { code });
      alert("Áp dụng voucher GIAM10 (-10%) thành công!");
    } else {
      alert("Mã không hợp lệ, demo chỉ hỗ trợ GIAM10.");
      localStorage.removeItem("cartVoucher");
    }
    render();
  });

  render();
}

// === PAGE: CHECKOUT =================================================

function initCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const cartSummary = document.getElementById("checkoutCartSummary");
  const totals = calcCartTotals();
  const cart = getCart();
  if (!cart.length) {
    cartSummary.innerHTML =
      '<p class="empty">Giỏ hàng đang trống, vui lòng thêm sản phẩm trước.</p>';
    form.style.display = "none";
    return;
  }

  cartSummary.innerHTML =
    "<ul>" +
    cart
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.productId);
        return `<li>${p.name} x${item.qty} - $${p.price * item.qty}</li>`;
      })
      .join("") +
    `</ul>
    <p>Tạm tính: $${totals.subtotal}</p>
    <p>Giảm giá: -$${totals.discount}</p>
    <p><strong>Tổng thanh toán: $${totals.total}</strong></p>`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const address = form.address.value.trim();
    const payment = form.payment.value;
    if (!address) {
      alert("Vui lòng nhập địa chỉ.");
      return;
    }
    const totals2 = calcCartTotals();
    const cartItems = getCart();
    const orderItems = cartItems.map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        qty: item.qty
      };
    });

    createOrder({
      address,
      payment,
      amount: totals2.total,
      items: orderItems
    });

    saveCart([]);
    localStorage.removeItem("cartVoucher");
    alert("Đặt hàng thành công! Chuyển sang trang đơn hàng.");
    window.location.href = "orders.html";
  });
}

// === PAGE: ORDERS ===================================================

function initOrdersPage() {
  const listEl = document.getElementById("orderList");
  if (!listEl) return;

  const orders = getOrders();
  if (!orders.length) {
    listEl.innerHTML =
      '<p class="empty">Chưa có đơn hàng nào. Hãy mua sắm ngay!</p>';
    return;
  }

  listEl.innerHTML = orders
    .map((order) => {
      const status = ORDER_STATUS_STEPS[order.statusIndex] || "Không rõ";
      let statusClass = "pending";
      if (order.statusIndex === 1) statusClass = "shipping";
      if (order.statusIndex >= 2) statusClass = "done";
      const date = new Date(order.createdAt).toLocaleString("vi-VN");

      const itemsHtml = order.items
        .map((it) => `<li>${it.name} x${it.qty}</li>`)
        .join("");

      const timeline = ORDER_STATUS_STEPS.map(
        (s, idx) =>
          `<div class="timeline-step ${
            idx <= order.statusIndex ? "active" : ""
          }">${s}</div>`
      ).join("");

      return `
      <div class="card">
        <div class="card-header">
          <span>Đơn #${order.id}</span>
          <span class="badge-status ${statusClass}">${status}</span>
        </div>
        <div class="card-sub">Ngày tạo: ${date}</div>
        <div class="card-sub">Địa chỉ: ${order.address}</div>
        <div class="card-sub">Tổng tiền: $${order.amount}</div>
        <ul>${itemsHtml}</ul>
        <div class="timeline">${timeline}</div>
      </div>
    `;
    })
    .join("");
}

// === PAGE: RETURNS ==================================================

function initReturnsPage() {
  const form = document.getElementById("returnForm");
  if (!form) return;

  const orderSelect = form.orderId;
  const listEl = document.getElementById("returnList");

  const orders = getOrders();
  orderSelect.innerHTML =
    '<option value="">Chọn đơn hàng</option>' +
    orders
      .map(
        (o) =>
          `<option value="${o.id}">Đơn #${o.id} - $${o.amount}</option>`
      )
      .join("");

  function renderReturns() {
    const list = getReturns();
    if (!list.length) {
      listEl.innerHTML =
        '<p class="empty">Chưa có yêu cầu đổi/trả nào.</p>';
      return;
    }
    listEl.innerHTML = list
      .map(
        (r) => `
        <div class="card">
          <div class="card-header">
            <span>Yêu cầu #${r.id}</span>
            <span class="badge-status pending">${r.status}</span>
          </div>
          <div class="card-sub">Đơn liên quan: #${r.orderId}</div>
          <div class="card-sub">Lý do: ${r.reason}</div>
          ${
            r.imageName
              ? `<div class="card-sub">Ảnh minh họa: ${r.imageName}</div>`
              : ""
          }
        </div>
      `
      )
      .join("");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const orderId = form.orderId.value;
    const reason = form.reason.value.trim();
    const file = form.image.files[0];
    if (!orderId || !reason) {
      alert("Vui lòng chọn đơn hàng và nhập lý do.");
      return;
    }
    const list = getReturns();
    list.unshift({
      id: Date.now(),
      orderId,
      reason,
      imageName: file ? file.name : "",
      status: "Đang xử lý"
    });
    saveReturns(list);
    form.reset();
    renderReturns();
    alert("Đã gửi yêu cầu đổi/trả.");
  });

  renderReturns();
}

// === PAGE: PROFILE ==================================================

function initProfilePage() {
  const user = getCurrentUser();
  const infoBox = document.getElementById("profileInfo");
  const form = document.getElementById("profileForm");
  const passForm = document.getElementById("passwordForm");
  if (!infoBox) return;

  if (!user) {
    infoBox.innerHTML =
      '<p class="empty">Bạn chưa đăng nhập. <a href="login.html">Đăng nhập ngay</a></p>';
    form.style.display = "none";
    passForm.style.display = "none";
    return;
  }

  infoBox.innerHTML = `
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Họ tên:</strong> ${user.fullName || ""}</p>
    <p><strong>Địa chỉ:</strong> ${user.address || ""}</p>
  `;

  form.fullName.value = user.fullName || "";
  form.address.value = user.address || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    user.fullName = form.fullName.value.trim();
    user.address = form.address.value.trim();
    setStorage("user", user);
    alert("Cập nhật hồ sơ thành công.");
    initProfilePage();
  });

  passForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const current = passForm.currentPassword.value;
    const newPass = passForm.newPassword.value;
    if (current !== user.password) {
      alert("Mật khẩu hiện tại không đúng.");
      return;
    }
    if (!newPass) {
      alert("Mật khẩu mới không được trống.");
      return;
    }
    user.password = newPass;
    setStorage("user", user);
    passForm.reset();
    alert("Đổi mật khẩu thành công.");
  });
}

// === PAGE: LOGIN ====================================================

function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const user = getStorage("user", null);
    if (!user || user.email !== email || user.password !== password) {
      alert("Sai email hoặc mật khẩu (demo chỉ lưu 1 tài khoản trong localStorage).");
      return;
    }
    alert("Đăng nhập thành công.");
    window.location.href = "category.html";
  });
}

// === PAGE: REGISTER =================================================

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const fullName = form.fullName.value.trim();

    if (!email || !password) {
      alert("Email và mật khẩu không được trống.");
      return;
    }

    const user = { email, password, fullName };
    setStorage("user", user);
    alert("Đăng ký thành công. Bạn có thể đăng nhập ngay.");
    window.location.href = "login.html";
  });
}

// === PAGE: FORGOT PASSWORD =========================================

function initForgotPage() {
  const form = document.getElementById("forgotForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const newPass = form.newPassword.value;

    const user = getStorage("user", null);
    if (!user || user.email !== email) {
      alert("Không tìm thấy tài khoản với email này (demo).");
      return;
    }
    if (!newPass) {
      alert("Mật khẩu mới không được trống.");
      return;
    }
    user.password = newPass;
    setStorage("user", user);
    alert("Đặt lại mật khẩu thành công. Hãy đăng nhập lại.");
    window.location.href = "login.html";
  });
}

// === BOOTSTRAP ======================================================

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  const page = document.body.dataset.page;
  switch (page) {
    case "category":
      initCategoryPage();
      break;
    case "detail":
      initProductDetailPage();
      break;
    case "cart":
      initCartPage();
      break;
    case "checkout":
      initCheckoutPage();
      break;
    case "orders":
      initOrdersPage();
      break;
    case "returns":
      initReturnsPage();
      break;
    case "profile":
      initProfilePage();
      break;
    case "login":
      initLoginPage();
      break;
    case "register":
      initRegisterPage();
      break;
    case "forgot":
      initForgotPage();
      break;
  }
});
