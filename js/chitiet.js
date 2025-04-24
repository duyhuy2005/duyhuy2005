
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const image = urlParams.get('image');
    const priceString = urlParams.get('price');

    const price = parseFloat(priceString.replace(/\./g, '').replace('đ', '').trim());

    document.getElementById('product-name').innerText = name;
    document.getElementById('product-image').src = image;
    document.getElementById('product-price').innerText = priceString;

    document.getElementById('buy-button').setAttribute('data-price', price);
}
function addToCart(name, priceString, imageUrl) {
    const price = parseFloat(priceString.replace(/\./g, '').replace('đ', '').trim());
    
    let product = {
        name: name,
        price: price, 
        imageUrl: imageUrl
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${name} đã được thêm vào giỏ hàng.`);
}
