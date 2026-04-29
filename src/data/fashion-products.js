export const fashionProducts = [
  // Men's Fashion (12 products)
  {
    id: 301,
    name: "Premium Cotton T-Shirt",
    shop: "Zara Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    description: "Soft breathable cotton t-shirt perfect for casual wear",
    rating: { star: 4, point: 4.5 },
    unit_price: 29.99,
    discount_percent: 15,
    sold: 2450,
    location: "New York",
    label: "Best Seller",
    brand: "Zara",
    size: "M",
    color: "#000000",
    category: "mens-fashion",
  },
  {
    id: 302,
    name: "Slim Fit Jeans",
    shop: "Levi's Official",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 5, point: 4.8 },
    unit_price: 89.99,
    discount_percent: 20,
    sold: 1890,
    location: "Los Angeles",
    brand: "Levi's",
    size: "32",
    color: "#4682B4",
    category: "mens-fashion",
  },
  {
    id: 303,
    name: "Leather Bomber Jacket",
    shop: "Alpha Industries",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 4, point: 4.7 },
    unit_price: 199.99,
    discount_percent: 10,
    sold: 1200,
    location: "Chicago",
    label: "New Arrival",
    brand: "Alpha Industries",
    size: "L",
    color: "#000000",
    category: "mens-fashion",
  },
  {
    id: 304,
    name: "Classic White Sneakers",
    shop: "Nike Store",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 5, point: 4.9 },
    unit_price: 129.99,
    discount_percent: 0,
    sold: 3400,
    location: "Miami",
    brand: "Nike",
    size: "10",
    color: "#FFFFFF",
    category: "mens-fashion",
  },
  // Add 8 more men's products...

  // Women's Fashion (12 products)
  {
    id: 351,
    name: "Floral Maxi Dress",
    shop: "Mango Women",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 5, point: 4.6 },
    unit_price: 79.99,
    discount_percent: 25,
    sold: 2100,
    location: "New York",
    label: "Hot Deal",
    brand: "Mango",
    size: "M",
    color: "#FF69B4",
    category: "womens-fashion",
  },
  {
    id: 352,
    name: "Silk Blouse",
    shop: "Zara Women",
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 4, point: 4.4 },
    unit_price: 59.99,
    discount_percent: 10,
    sold: 1670,
    location: "Los Angeles",
    brand: "Zara",
    size: "S",
    color: "#F8F8FF",
    category: "womens-fashion",
  },
  // Add 10 more...

  // Accessories (8 products)
  {
    id: 401,
    name: "Classic Leather Watch",
    shop: "Rolex Boutique",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0652e6d827?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 5, point: 4.9 },
    unit_price: 499.99,
    discount_percent: 5,
    sold: 890,
    location: "Dubai",
    brand: "Rolex",
    size: "One Size",
    color: "#C0C0C0",
    category: "accessories",
  },
  // Add 7 more...

  // Footwear (8 products)
  {
    id: 451,
    name: "Air Max Sneakers",
    shop: "Nike Footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 5, point: 4.8 },
    unit_price: 159.99,
    discount_percent: 15,
    sold: 4500,
    location: "London",
    label: "Top Rated",
    brand: "Nike",
    size: "9",
    color: "#FF6B6B",
    category: "footwear",
  },
  // Add 7 more...

  // Best Sellers (mix from all, 8 products)
  {
    id: 501,
    name: "Viral Crop Top",
    shop: "Shein Trends",
    image:
      "https://images.unsplash.com/photo-1598033124237-b93d9ac1b333?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80",
    rating: { star: 4, point: 4.7 },
    unit_price: 24.99,
    discount_percent: 30,
    sold: 12500,
    location: "Tokyo",
    label: "Best Seller",
    brand: "Shein",
    size: "S",
    color: "#4ECDC4",
    category: "best-sellers",
  },
  // Add 7 more...

  // All Products will use all fashion + original products
];

export const allShopProducts = [...fashionProducts]; // Will merge with original later
