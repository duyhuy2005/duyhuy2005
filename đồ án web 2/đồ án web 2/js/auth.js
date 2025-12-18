// ============================================
// AUTHENTICATION MODULE
// ============================================

// Declare necessary functions
function getFromStorage(key, defaultValue) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function showToast(message, type = "success") {
  alert(message)
}

const Auth = {
  user: getFromStorage("user", null),

  isLoggedIn() {
    return this.user !== null
  },

  getUser() {
    return this.user
  },

  login(email, password) {
    if (email && password) {
      const user = {
        id: generateId(),
        email: email,
        name: email.split("@")[0],
        phone: "",
        address: "",
      }
      this.user = user
      saveToStorage("user", user)
      showToast("Đăng nhập thành công!")
      window.location.href = "index.html"
      return true
    }
    showToast("Email hoặc mật khẩu không đúng!", "error")
    return false
  },

  register(name, email, password) {
    if (name && email && password) {
      const user = {
        id: generateId(),
        email: email,
        name: name,
        phone: "",
        address: "",
      }
      this.user = user
      saveToStorage("user", user)
      showToast("Đăng ký thành công!")
      window.location.href = "index.html"
      return true
    }
    showToast("Vui lòng điền đầy đủ thông tin!", "error")
    return false
  },

  logout() {
    this.user = null
    localStorage.removeItem("user")
    showToast("Đã đăng xuất!")
    window.location.href = "index.html"
  },

  forgotPassword(email) {
    if (email) {
      showToast("Đã gửi link khôi phục mật khẩu đến email của bạn!")
      return true
    }
    showToast("Vui lòng nhập email!", "error")
    return false
  },
}

// Login form handler
function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  Auth.login(email, password)
}

// Register form handler
function handleRegister(event) {
  event.preventDefault()
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (password !== confirmPassword) {
    showToast("Mật khẩu xác nhận không khớp!", "error")
    return
  }

  Auth.register(name, email, password)
}

// Forgot password form handler
function handleForgotPassword(event) {
  event.preventDefault()
  const email = document.getElementById("email").value
  Auth.forgotPassword(email)
}

// Logout handler
function logout() {
  Auth.logout()
}
