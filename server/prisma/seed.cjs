const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = [
    { email: 'super@example.com', password: 'super123', name: 'Super Admin', role: 'SUPER_ADMIN' },
    { email: 'admin@example.com', password: 'admin123', name: 'Admin', role: 'ADMIN' },
    { email: 'user@example.com', password: 'user123', name: 'User', role: 'USER' },
  ];
  
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({ 
      where: { email: u.email }, 
      update: {}, 
      create: { email: u.email, password: hashed, name: u.name, role: u.role } 
    });
  }

  // Create categories
  const categories = [
    { name: 'Smartphones', imageUrl: 'https://picsum.photos/seed/phones/300/200' },
    { name: 'Laptops', imageUrl: 'https://picsum.photos/seed/laptops/300/200' },
    { name: 'Tablets', imageUrl: 'https://picsum.photos/seed/tablets/300/200' },
    { name: 'Headphones', imageUrl: 'https://picsum.photos/seed/headphones/300/200' },
    { name: 'Smartwatches', imageUrl: 'https://picsum.photos/seed/watches/300/200' },
    { name: 'Gaming', imageUrl: 'https://picsum.photos/seed/gaming/300/200' },
  ];

  const createdCategories = [];
  for (const c of categories) {
    const category = await prisma.category.upsert({ 
      where: { name: c.name }, 
      update: {}, 
      create: c 
    });
    createdCategories.push(category);
  }

  // Create products
  const products = [
    // Smartphones
    { 
      name: 'iPhone 15 Pro', 
      description: 'Latest iPhone with A17 Pro chip and titanium design', 
      price: 99900, 
      categoryId: createdCategories[0].id,
      stock: 50,
      imageUrl: 'https://picsum.photos/seed/iphone15/600/400',
      specs: JSON.stringify({
        'Display': '6.1" Super Retina XDR',
        'Chip': 'A17 Pro',
        'Storage': '128GB',
        'Camera': '48MP Main + 12MP Ultra Wide'
      })
    },
    { 
      name: 'Samsung Galaxy S24', 
      description: 'Premium Android flagship with AI features', 
      price: 89900, 
      categoryId: createdCategories[0].id,
      stock: 45,
      imageUrl: 'https://picsum.photos/seed/galaxys24/600/400',
      specs: JSON.stringify({
        'Display': '6.2" Dynamic AMOLED',
        'Chip': 'Snapdragon 8 Gen 3',
        'Storage': '256GB',
        'Camera': '50MP Main + 12MP Ultra Wide'
      })
    },
    { 
      name: 'Google Pixel 8', 
      description: 'Best camera phone with Google AI', 
      price: 69900, 
      categoryId: createdCategories[0].id,
      stock: 30,
      imageUrl: 'https://picsum.photos/seed/pixel8/600/400',
      specs: JSON.stringify({
        'Display': '6.2" OLED',
        'Chip': 'Google Tensor G3',
        'Storage': '128GB',
        'Camera': '50MP Main + 12MP Ultra Wide'
      })
    },

    // Laptops
    { 
      name: 'MacBook Pro 16"', 
      description: 'Professional laptop with M3 Max chip', 
      price: 249900, 
      categoryId: createdCategories[1].id,
      stock: 25,
      imageUrl: 'https://picsum.photos/seed/macbook16/600/400',
      specs: JSON.stringify({
        'Display': '16" Liquid Retina XDR',
        'Chip': 'M3 Max',
        'RAM': '32GB',
        'Storage': '1TB SSD'
      })
    },
    { 
      name: 'Dell XPS 15', 
      description: 'Premium Windows laptop for creators', 
      price: 189900, 
      categoryId: createdCategories[1].id,
      stock: 20,
      imageUrl: 'https://picsum.photos/seed/dellxps/600/400',
      specs: JSON.stringify({
        'Display': '15.6" 4K OLED',
        'CPU': 'Intel i9-13900H',
        'GPU': 'RTX 4070',
        'RAM': '32GB DDR5'
      })
    },
    { 
      name: 'Lenovo ThinkPad X1', 
      description: 'Business laptop with premium build', 
      price: 159900, 
      categoryId: createdCategories[1].id,
      stock: 35,
      imageUrl: 'https://picsum.photos/seed/thinkpad/600/400',
      specs: JSON.stringify({
        'Display': '14" 2.8K OLED',
        'CPU': 'Intel i7-1370P',
        'RAM': '16GB LPDDR5',
        'Storage': '512GB SSD'
      })
    },

    // Tablets
    { 
      name: 'iPad Pro 12.9"', 
      description: 'Most powerful iPad with M2 chip', 
      price: 109900, 
      categoryId: createdCategories[2].id,
      stock: 40,
      imageUrl: 'https://picsum.photos/seed/ipadpro/600/400',
      specs: JSON.stringify({
        'Display': '12.9" Liquid Retina XDR',
        'Chip': 'M2',
        'Storage': '256GB',
        'Camera': '12MP Ultra Wide'
      })
    },
    { 
      name: 'Samsung Galaxy Tab S9', 
      description: 'Premium Android tablet', 
      price: 89900, 
      categoryId: createdCategories[2].id,
      stock: 30,
      imageUrl: 'https://picsum.photos/seed/tabs9/600/400',
      specs: JSON.stringify({
        'Display': '11" Dynamic AMOLED',
        'Chip': 'Snapdragon 8 Gen 2',
        'Storage': '256GB',
        'S Pen': 'Included'
      })
    },

    // Headphones
    { 
      name: 'Sony WH-1000XM5', 
      description: 'Best noise-canceling headphones', 
      price: 39900, 
      categoryId: createdCategories[3].id,
      stock: 60,
      imageUrl: 'https://picsum.photos/seed/sonyxm5/600/400',
      specs: JSON.stringify({
        'Type': 'Over-ear',
        'Noise Cancellation': 'Yes',
        'Battery': '30 hours',
        'Connectivity': 'Bluetooth 5.2'
      })
    },
    { 
      name: 'AirPods Pro 2', 
      description: 'Premium wireless earbuds with spatial audio', 
      price: 24900, 
      categoryId: createdCategories[3].id,
      stock: 80,
      imageUrl: 'https://picsum.photos/seed/airpodspro/600/400',
      specs: JSON.stringify({
        'Type': 'In-ear',
        'Noise Cancellation': 'Active',
        'Battery': '6 hours',
        'Spatial Audio': 'Yes'
      })
    },

    // Smartwatches
    { 
      name: 'Apple Watch Series 9', 
      description: 'Latest Apple Watch with health features', 
      price: 39900, 
      categoryId: createdCategories[4].id,
      stock: 50,
      imageUrl: 'https://picsum.photos/seed/applewatch/600/400',
      specs: JSON.stringify({
        'Display': 'Always-On Retina',
        'GPS': 'Built-in',
        'Heart Rate': 'ECG',
        'Water Resistance': '50m'
      })
    },
    { 
      name: 'Samsung Galaxy Watch 6', 
      description: 'Premium Android smartwatch', 
      price: 34900, 
      categoryId: createdCategories[4].id,
      stock: 45,
      imageUrl: 'https://picsum.photos/seed/galaxywatch/600/400',
      specs: JSON.stringify({
        'Display': 'AMOLED',
        'OS': 'Wear OS',
        'Battery': '40 hours',
        'Health Tracking': 'Advanced'
      })
    },

    // Gaming
    { 
      name: 'PlayStation 5', 
      description: 'Next-gen gaming console', 
      price: 49900, 
      categoryId: createdCategories[5].id,
      stock: 25,
      imageUrl: 'https://picsum.photos/seed/ps5/600/400',
      specs: JSON.stringify({
        'CPU': 'AMD Zen 2',
        'GPU': 'AMD RDNA 2',
        'Storage': '825GB SSD',
        '4K Gaming': 'Yes'
      })
    },
    { 
      name: 'Nintendo Switch OLED', 
      description: 'Portable gaming with OLED screen', 
      price: 34900, 
      categoryId: createdCategories[5].id,
      stock: 40,
      imageUrl: 'https://picsum.photos/seed/switch/600/400',
      specs: JSON.stringify({
        'Display': '7" OLED',
        'Storage': '64GB',
        'Battery': '4.5-9 hours',
        'Joy-Con': 'Included'
      })
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({ 
      where: { name: p.name }, 
      update: {}, 
      create: p 
    });
  }
}

main().then(async () => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });


