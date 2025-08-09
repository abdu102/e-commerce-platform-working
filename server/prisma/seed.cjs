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

    // Additional 25 products
    // Smartphones (5)
    {
      name: 'OnePlus 12',
      description: 'Flagship performance with fast charging',
      price: 79900,
      categoryId: createdCategories[0].id,
      stock: 35,
      imageUrl: 'https://picsum.photos/seed/oneplus12/600/400',
      specs: JSON.stringify({
        'Display': '6.7" AMOLED 120Hz',
        'Chip': 'Snapdragon 8 Gen 3',
        'Storage': '256GB'
      })
    },
    {
      name: 'Xiaomi 14 Pro',
      description: 'Premium camera system with Leica optics',
      price: 89900,
      categoryId: createdCategories[0].id,
      stock: 28,
      imageUrl: 'https://picsum.photos/seed/xiaomi14pro/600/400',
      specs: JSON.stringify({
        'Display': '6.7" LTPO OLED',
        'Chip': 'Snapdragon 8 Gen 3',
        'Storage': '256GB'
      })
    },
    {
      name: 'Sony Xperia 1 V',
      description: 'Cinematic 4K HDR OLED and pro camera tools',
      price: 99900,
      categoryId: createdCategories[0].id,
      stock: 20,
      imageUrl: 'https://picsum.photos/seed/xperia1v/600/400',
      specs: JSON.stringify({
        'Display': '6.5" 4K OLED',
        'Chip': 'Snapdragon 8 Gen 2',
        'Storage': '256GB'
      })
    },
    {
      name: 'Nothing Phone (2)',
      description: 'Unique design with Glyph interface',
      price: 59900,
      categoryId: createdCategories[0].id,
      stock: 42,
      imageUrl: 'https://picsum.photos/seed/nothing2/600/400',
      specs: JSON.stringify({
        'Display': '6.7" OLED 120Hz',
        'Chip': 'Snapdragon 8+ Gen 1',
        'Storage': '256GB'
      })
    },
    {
      name: 'Motorola Edge 40 Pro',
      description: 'Curved display and fast 125W charging',
      price: 74900,
      categoryId: createdCategories[0].id,
      stock: 33,
      imageUrl: 'https://picsum.photos/seed/edge40pro/600/400',
      specs: JSON.stringify({
        'Display': '6.67" pOLED 165Hz',
        'Chip': 'Snapdragon 8 Gen 2',
        'Storage': '256GB'
      })
    },

    // Laptops (4)
    {
      name: 'HP Spectre x360',
      description: 'Convertible ultrabook with OLED display',
      price: 159900,
      categoryId: createdCategories[1].id,
      stock: 22,
      imageUrl: 'https://picsum.photos/seed/spectrex360/600/400',
      specs: JSON.stringify({
        'Display': '13.5" OLED',
        'CPU': 'Intel i7 14th Gen',
        'RAM': '16GB'
      })
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      description: 'Portable gaming laptop with strong GPU',
      price: 199900,
      categoryId: createdCategories[1].id,
      stock: 18,
      imageUrl: 'https://picsum.photos/seed/zephyrusg14/600/400',
      specs: JSON.stringify({
        'Display': '14" QHD 165Hz',
        'CPU': 'Ryzen 9',
        'GPU': 'RTX 4070'
      })
    },
    {
      name: 'Acer Swift 5',
      description: 'Lightweight productivity laptop',
      price: 129900,
      categoryId: createdCategories[1].id,
      stock: 26,
      imageUrl: 'https://picsum.photos/seed/swift5/600/400',
      specs: JSON.stringify({
        'Display': '14" IPS',
        'CPU': 'Intel i7 13th Gen',
        'RAM': '16GB'
      })
    },
    {
      name: 'Razer Blade 15',
      description: 'Premium gaming laptop with sleek design',
      price: 249900,
      categoryId: createdCategories[1].id,
      stock: 14,
      imageUrl: 'https://picsum.photos/seed/blade15/600/400',
      specs: JSON.stringify({
        'Display': '15.6" QHD 240Hz',
        'CPU': 'Intel i9',
        'GPU': 'RTX 4080'
      })
    },

    // Tablets (4)
    {
      name: 'iPad Air (M2)',
      description: 'Balanced power and portability',
      price: 69900,
      categoryId: createdCategories[2].id,
      stock: 38,
      imageUrl: 'https://picsum.photos/seed/ipadairm2/600/400',
      specs: JSON.stringify({
        'Display': '10.9" Liquid Retina',
        'Chip': 'Apple M2',
        'Storage': '128GB'
      })
    },
    {
      name: 'Xiaomi Pad 6',
      description: 'Affordable high-refresh tablet',
      price: 39900,
      categoryId: createdCategories[2].id,
      stock: 44,
      imageUrl: 'https://picsum.photos/seed/xiaomipad6/600/400',
      specs: JSON.stringify({
        'Display': '11" 144Hz',
        'Chip': 'Snapdragon 870',
        'Storage': '128GB'
      })
    },
    {
      name: 'Lenovo Tab P12 Pro',
      description: 'Entertainment tablet with AMOLED screen',
      price: 69900,
      categoryId: createdCategories[2].id,
      stock: 27,
      imageUrl: 'https://picsum.photos/seed/lenovop12pro/600/400',
      specs: JSON.stringify({
        'Display': '12.6" AMOLED',
        'Chip': 'Snapdragon 870',
        'Storage': '256GB'
      })
    },
    {
      name: 'OnePlus Pad',
      description: 'Fast and fluid Android tablet',
      price: 47900,
      categoryId: createdCategories[2].id,
      stock: 31,
      imageUrl: 'https://picsum.photos/seed/onepluspad/600/400',
      specs: JSON.stringify({
        'Display': '11.6" 144Hz',
        'Chip': 'Dimensity 9000',
        'Storage': '128GB'
      })
    },

    // Headphones (4)
    {
      name: 'Bose QuietComfort Ultra',
      description: 'Premium ANC with immersive audio',
      price: 42900,
      categoryId: createdCategories[3].id,
      stock: 52,
      imageUrl: 'https://picsum.photos/seed/boseultra/600/400',
      specs: JSON.stringify({
        'Type': 'Over-ear',
        'Noise Cancellation': 'Adaptive',
        'Battery': '24 hours'
      })
    },
    {
      name: 'Sennheiser Momentum 4',
      description: 'Audiophile sound with long battery life',
      price: 34900,
      categoryId: createdCategories[3].id,
      stock: 48,
      imageUrl: 'https://picsum.photos/seed/momentum4/600/400',
      specs: JSON.stringify({
        'Type': 'Over-ear',
        'Noise Cancellation': 'Yes',
        'Battery': '60 hours'
      })
    },
    {
      name: 'Beats Studio Pro',
      description: 'Punchy sound with Apple ecosystem features',
      price: 34900,
      categoryId: createdCategories[3].id,
      stock: 55,
      imageUrl: 'https://picsum.photos/seed/beatsstudiopro/600/400',
      specs: JSON.stringify({
        'Type': 'Over-ear',
        'Noise Cancellation': 'Active',
        'Battery': '40 hours'
      })
    },
    {
      name: 'JBL Tour One M2',
      description: 'Balanced tuning with strong ANC',
      price: 29900,
      categoryId: createdCategories[3].id,
      stock: 60,
      imageUrl: 'https://picsum.photos/seed/jbltourm2/600/400',
      specs: JSON.stringify({
        'Type': 'Over-ear',
        'Noise Cancellation': 'Adaptive',
        'Battery': '50 hours'
      })
    },

    // Smartwatches (4)
    {
      name: 'Garmin Fenix 7',
      description: 'Rugged multisport GPS watch',
      price: 69900,
      categoryId: createdCategories[4].id,
      stock: 24,
      imageUrl: 'https://picsum.photos/seed/fenix7/600/400',
      specs: JSON.stringify({
        'Display': 'MIP',
        'GPS': 'Multi-band',
        'Battery': '18 days'
      })
    },
    {
      name: 'Fitbit Versa 4',
      description: 'Fitness-focused smartwatch',
      price: 22900,
      categoryId: createdCategories[4].id,
      stock: 50,
      imageUrl: 'https://picsum.photos/seed/versa4/600/400',
      specs: JSON.stringify({
        'Display': 'AMOLED',
        'GPS': 'Built-in',
        'Battery': '6 days'
      })
    },
    {
      name: 'Huawei Watch GT 4',
      description: 'Elegant design with long battery',
      price: 29900,
      categoryId: createdCategories[4].id,
      stock: 36,
      imageUrl: 'https://picsum.photos/seed/watchgt4/600/400',
      specs: JSON.stringify({
        'Display': 'AMOLED',
        'GPS': 'Yes',
        'Battery': '14 days'
      })
    },
    {
      name: 'Google Pixel Watch 2',
      description: 'Deep Fitbit integration and safety features',
      price: 34900,
      categoryId: createdCategories[4].id,
      stock: 40,
      imageUrl: 'https://picsum.photos/seed/pixelwatch2/600/400',
      specs: JSON.stringify({
        'Display': 'AMOLED',
        'GPS': 'Built-in',
        'Battery': '24 hours'
      })
    },

    // Gaming (4)
    {
      name: 'Xbox Series X',
      description: 'Powerful 4K gaming console',
      price: 49900,
      categoryId: createdCategories[5].id,
      stock: 30,
      imageUrl: 'https://picsum.photos/seed/xboxseriesx/600/400',
      specs: JSON.stringify({
        'CPU': '8-Core AMD',
        'GPU': '12 TFLOPS RDNA 2',
        'Storage': '1TB SSD'
      })
    },
    {
      name: 'Steam Deck OLED',
      description: 'Handheld PC gaming with OLED screen',
      price: 64900,
      categoryId: createdCategories[5].id,
      stock: 22,
      imageUrl: 'https://picsum.photos/seed/steamdeckoled/600/400',
      specs: JSON.stringify({
        'Display': '7.4" OLED',
        'Storage': '512GB',
        'OS': 'SteamOS'
      })
    },
    {
      name: 'Asus ROG Ally',
      description: 'Windows handheld gaming PC',
      price: 69900,
      categoryId: createdCategories[5].id,
      stock: 18,
      imageUrl: 'https://picsum.photos/seed/rogalley/600/400',
      specs: JSON.stringify({
        'Display': '7" 120Hz',
        'CPU': 'Ryzen Z1 Extreme',
        'Storage': '512GB'
      })
    },
    {
      name: 'Nintendo Switch Lite',
      description: 'Compact handheld gaming console',
      price: 19900,
      categoryId: createdCategories[5].id,
      stock: 40,
      imageUrl: 'https://picsum.photos/seed/switchlite/600/400',
      specs: JSON.stringify({
        'Display': '5.5" LCD',
        'Storage': '32GB',
        'Handheld Only': 'Yes'
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

  // Seed 3-4 reviews per product if none exist yet
  const productList = await prisma.product.findMany();
  const reviewers = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  const sampleComments = [
    'Fantastic quality and great value for money.',
    'Works as expected. Battery life could be better.',
    'Exceeded my expectations. Highly recommend!',
    'Solid performance, sleek design. Worth it.',
    'Good overall, shipping was fast.',
  ];
  for (const prod of productList) {
    const existingCount = await prisma.review.count({ where: { productId: prod.id } });
    if (existingCount > 0) continue;
    const num = 3 + Math.floor(Math.random() * 2); // 3-4 reviews
    for (let i = 0; i < num; i++) {
      const user = reviewers[(i + prod.id) % reviewers.length];
      const rating = 4 + Math.floor(Math.random() * 2); // 4-5 stars
      const comment = sampleComments[(i + rating) % sampleComments.length];
      const photos = Math.random() > 0.7 ? [
        `https://picsum.photos/seed/rev_${prod.id}_${i}/200/200`
      ] : undefined;
      await prisma.review.create({
        data: {
          userId: user.id,
          productId: prod.id,
          rating,
          comment,
          photos: photos ? JSON.stringify(photos) : undefined,
        }
      });
    }
  }
}

main().then(async () => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });


