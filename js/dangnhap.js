function login() {
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  if (username === "" || password === "") {
      alert("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
      return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const userAccount = accounts.find((account) => account.username === username && account.password === password);

  if (userAccount) {
      alert("Đăng nhập thành công!");
      localStorage.setItem("isLoggedIn", "true"); 
      window.location.href = "../html/index.html";
  } else {
      alert("Tên đăng nhập hoặc mật khẩu không đúng.");
  }
}
