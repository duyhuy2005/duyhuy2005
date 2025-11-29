// ====== KEY lưu trong localStorage ======
const LS_USERS_KEY = "larkonUsers";
const LS_CURRENT_USER_KEY = "larkonCurrentUser";

// ====== HÀM LÀM VIỆC VỚI localStorage ======
function loadUsers() {
  const raw = localStorage.getItem(LS_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const raw = localStorage.getItem(LS_CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(LS_CURRENT_USER_KEY);
}

// Tìm user theo email
function findUserByEmail(email) {
  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ====== HEADER: HIỂN THỊ KHU VỰC USER ======
function renderUserArea() {
  const userArea = document.getElementById("userArea");
  if (!userArea) return;

  const user = getCurrentUser();

  if (!user) {
    userArea.innerHTML = `
      <a href="login.html" class="header-btn">Đăng nhập</a>
      <a href="registe.html" class="header-btn primary">Đăng ký</a>
    `;
  } else {
    userArea.innerHTML = `
      <span>Xin chào, <strong>${user.name}</strong></span>
      <button id="logoutBtn" class="header-btn">Đăng xuất</button>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      clearCurrentUser();
      // Sau khi logout cho quay về trang đăng nhập
      window.location.href = "login.html";
    });
  }
}

// Nếu đã đăng nhập mà vào trang login/register/forgot thì tự chuyển về index
function redirectIfAlreadyLoggedIn() {
  const page = document.body.dataset.page;
  const isAuthPage = ["login", "register", "forgot"].includes(page);
  const user = getCurrentUser();

  if (isAuthPage && user) {
    window.location.href = "index.html";
  }
}

// ====== XỬ LÝ FORM ĐĂNG NHẬP ======
function setupLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    const user = findUserByEmail(email);
    if (!user) {
      alert("Không tìm thấy tài khoản với email này. Vui lòng đăng ký mới.");
      return;
    }

    if (user.password !== password) {
      alert("Mật khẩu không đúng!");
      return;
    }

    setCurrentUser(user);
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  });
}

// ====== XỬ LÝ FORM ĐĂNG KÝ ======
function setupRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("registerConfirm").value.trim();

    if (!name || !email || !password || !confirm) {
      alert("Vui lòng nhập đầy đủ tất cả các trường!");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự (demo).");
      return;
    }

    if (password !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (findUserByEmail(email)) {
      alert("Email này đã được đăng ký, vui lòng dùng email khác.");
      return;
    }

    const users = loadUsers();
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    alert("Đăng ký thành công! Bạn đã được đăng nhập.");
    window.location.href = "index.html";
  });
}

// ====== XỬ LÝ FORM QUÊN MẬT KHẨU ======
function setupForgotForm() {
  const form = document.getElementById("forgotForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) {
      alert("Vui lòng nhập email đã đăng ký!");
      return;
    }

    const user = findUserByEmail(email);
    if (!user) {
      alert("Không tìm thấy tài khoản với email này.");
      return;
    }

    // DEMO: giả lập gửi email đặt lại mật khẩu
    alert(
      "Đã gửi liên kết đặt lại mật khẩu tới " +
        email +
        " (DEMO, không thực sự gửi)."
    );

    // Có thể cho quay lại trang đăng nhập
    window.location.href = "login.html";
  });
}

// ====== KHỞI TẠO KHI LOAD TRANG ======
document.addEventListener("DOMContentLoaded", () => {
  renderUserArea();
  redirectIfAlreadyLoggedIn();
  setupLoginForm();
  setupRegisterForm();
  setupForgotForm();
});
