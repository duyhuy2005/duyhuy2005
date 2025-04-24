var images = [
  "https://i.pinimg.com/564x/bc/75/d5/bc75d56fa512a26ba3fcce5c98f706c0.jpg",
  "https://cdn.tgdd.vn/Files/2022/08/22/1458526/h2-luxury_1280x720-800-resize.jpg",
  "https://bizweb.dktcdn.net/100/319/996/products/z2966645338720-b1489fc48aa52a4eb8121660d3f1171f.jpg?v=1637915699427"
];
var currentIndex = 0;

function loadImage() {
  document.getElementById("image").src = images[currentIndex];
}

function changeImage(step) {
  currentIndex = (currentIndex + step + images.length) % images.length;
  loadImage();
}

setInterval(function() {
  changeImage(1);
}, 3000);

function addToCart(name, price, imageUrl) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let product = {
      name: name,
      price: price,
      imageUrl: imageUrl
  };

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Sản phẩm đã được thêm vào giỏ hàng!");
}
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.querySelector('.menu').classList.toggle('show');
});









// --------------------------js cho gio hang----------------------------

function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let cartContainer = document.getElementById("cartContainer");

  if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
      document.getElementById("total-price").innerText = "0";
      return;
  }

  let tableHTML = `
      <table>
          <thead>
              <tr>
                  <th>Sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Giá</th>
                  <th>Xóa</th>
              </tr>
          </thead>
          <tbody>
  `;

  let total = 0;

  cart.forEach((item, index) => {
      total += item.price; 

      tableHTML += `
          <tr>
              <td>${item.name}</td>
              <td><img src="${item.imageUrl}" alt="${item.name}" style="width: 100px; height: auto;"></td>
              <td>${item.price.toLocaleString()} đ</td> <!-- Định dạng giá -->
              <td style="width: 120px; "><button onclick="removeFromCart(${index})">X</button></td> <!-- Đóng dấu ngoặc kép -->
          </tr>
      `;
  });


  tableHTML += `
          <tr>
              <td colspan="2"><strong>Tổng cộng</strong></td>
              <td><strong>${total.toLocaleString()} đ</strong></td> <!-- Định dạng giá tổng cộng -->
              <td></td>
          </tr>
          <tr>
              <td colspan="3" style="text-align: center;"><strong>Thanh toán:</strong></td>
              <td>
                  <div onclick="checkout()" style="color: white; background-color: green; border: none; border-radius: 5px; cursor: pointer;">Thanh toán</div>
              </td>
          </tr>
      </tbody>
  </table>
  `;

  cartContainer.innerHTML = tableHTML;

  document.getElementById("total-price").innerText = total.toLocaleString();
}

function removeFromCart(index) {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  

  cart.splice(index, 1);


  localStorage.setItem("cart", JSON.stringify(cart));

  console.log(`Sản phẩm tại chỉ số ${index} đã được xóa`); 

  displayCart();
}



function checkout() {
  alert('Thanh toán thành công!');
  localStorage.removeItem('cart'); 
  displayCart();
}

window.onload = displayCart;
