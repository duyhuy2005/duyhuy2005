// ============================================
// APPLICATION DATA
// ============================================
const AppData = {
  // Sample Products Data
  products: [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      category: "Điện thoại",
      price: 29990000,
      originalPrice: 34990000,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      rating: 4.8,
      reviews: 256,
      discount: 15,
      stock: 50,
      description: "iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch.",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      category: "Điện thoại",
      price: 27990000,
      originalPrice: 31990000,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
      rating: 4.7,
      reviews: 189,
      discount: 12,
      stock: 35,
      description: "Samsung Galaxy S24 Ultra với bút S Pen, camera 200MP, màn hình Dynamic AMOLED 2X.",
    },
    {
      id: 3,
      name: 'MacBook Pro 14" M3 Pro',
      category: "Laptop",
      price: 49990000,
      originalPrice: 54990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 4.9,
      reviews: 124,
      discount: 9,
      stock: 20,
      description: "MacBook Pro 14 inch với chip M3 Pro, 18GB RAM, 512GB SSD, màn hình Liquid Retina XDR.",
    },
    {
      id: 4,
      name: 'iPad Pro 12.9" M2',
      category: "Máy tính bảng",
      price: 28990000,
      originalPrice: 32990000,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      rating: 4.8,
      reviews: 98,
      discount: 12,
      stock: 25,
      description: "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil 2.",
    },
    {
      id: 5,
      name: "AirPods Pro 2",
      category: "Phụ kiện",
      price: 5990000,
      originalPrice: 6990000,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
      rating: 4.7,
      reviews: 312,
      discount: 14,
      stock: 100,
      description: "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, âm thanh không gian.",
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      category: "Đồng hồ",
      price: 10990000,
      originalPrice: 12990000,
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      rating: 4.6,
      reviews: 167,
      discount: 15,
      stock: 45,
      description: "Apple Watch Series 9 với chip S9 SiP, màn hình Always-On Retina, theo dõi sức khỏe.",
    },
    {
      id: 7,
      name: "Sony WH-1000XM5",
      category: "Phụ kiện",
      price: 7490000,
      originalPrice: 8990000,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
      rating: 4.8,
      reviews: 203,
      discount: 17,
      stock: 60,
      description: "Tai nghe chống ồn Sony WH-1000XM5 với âm thanh Hi-Res, pin 30 giờ.",
    },
    {
      id: 8,
      name: "Dell XPS 15",
      category: "Laptop",
      price: 42990000,
      originalPrice: 47990000,
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
      rating: 4.5,
      reviews: 87,
      discount: 10,
      stock: 15,
      description: "Dell XPS 15 với Intel Core i7 Gen 13, 16GB RAM, 512GB SSD, màn hình OLED 3.5K.",
    },
  ],

  // Categories
  categories: [
    { id: 1, name: "Điện thoại", icon: "📱", image: "public/placeholder.jpg" },
    { id: 2, name: "Laptop", icon: "💻", image: "public/gaming-laptop-black-rgb-keyboard.jpg" },
    { id: 3, name: "Máy tính bảng", icon: "📲", image: "public/placeholder.jpg" },
    { id: 4, name: "Đồng hồ", icon: "⌚", image: "public/smart-watch-black-fitness-tracker.jpg" },
    { id: 5, name: "Phụ kiện", icon: "🎧", image: "public/wireless-bluetooth-headphones-black.jpg" },
    { id: 6, name: "Tivi", icon: "📺", image: "public/placeholder.jpg" },
  ],

  // Get product by ID
  getProductById(id) {
    return this.products.find((p) => p.id === Number.parseInt(id))
  },

  // Filter products by category
  getProductsByCategory(category) {
    if (!category || category === "all") return this.products
    return this.products.filter((p) => p.category === category)
  },

  // Search products
  searchProducts(query) {
    const searchTerm = query.toLowerCase()
    return this.products.filter(
      (p) => p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm),
    )
  },
}
