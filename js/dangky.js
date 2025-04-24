function registerAccount() {

    const username = document.getElementById("registerUser").value;
    const password = document.getElementById("registerPass").value;
    const email = document.getElementById("registerEmail").value;


    if (username === "" || password === "" || email === "") {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const account = {
        username: username,
        password: password,
        email: email
    };

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    const isExistingUser = accounts.some((acc) => acc.username === username);
    if (isExistingUser) {
        alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
        return;
    }

    accounts.push(account);

    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Đăng ký thành công!");
    window.location.href = "../html/dangnhap.html";
}



