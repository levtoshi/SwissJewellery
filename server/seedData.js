import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const seedUsers = [
  {
    email: 'admin@shop.com',
    password: 'admin123',
    fullName: 'Admin',
    phone: '+380501234567',
    address: 'Kyiv',
    role: 'admin'
  },
  {
    email: 'customer@shop.com',
    password: 'customer123',
    fullName: 'John Green',
    phone: '+380507654321',
    address: 'Lviv',
    role: 'customer'
  }
];

const seedCategories = [
  { name: 'Rings', description: 'Swiss luxury rings crafted from gold and platinum' },
  { name: 'Earrings', description: 'Elegant Swiss-made earrings with diamonds and gemstones' },
  { name: 'Pendants', description: 'Exclusive Swiss pendants and necklaces' },
  { name: 'Bracelets', description: 'Luxury Swiss bracelets and bangles' },
  { name: 'Watches', description: 'High-end Swiss watches' }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('DB clear...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Creating products...');
    const users = await User.create(seedUsers);
    console.log(`Created ${users.length} users`);

    console.log('Creating categories...');
    const categories = await Category.create(seedCategories);
    console.log(`Created ${categories.length} categories`);

    const seedProducts = [
      // ================= RINGS =================
      {
        name: 'Swiss Diamond Gold Ring',
        description: '18K yellow gold ring with natural diamond, Swiss craftsmanship.',
        price: 4200,
        discount: 5,
        stock: 6,
        image: 'https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg',
        images: ['https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/Queen-3crt/diamond/diamond-Brillant_AA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg'],
        category: categories[0]._id
      },
      {
        name: 'Platinum Engagement Ring',
        description: 'Luxury platinum engagement ring with flawless diamond.',
        price: 8900,
        discount: 0,
        stock: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZsiqPruws4cW5133IIF2GUesLWhbzjiHJg&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZsiqPruws4cW5133IIF2GUesLWhbzjiHJg&s'],
        category: categories[0]._id
      },
      {
        name: 'White Gold Sapphire Ring',
        description: 'Swiss-made white gold ring with deep blue sapphire.',
        price: 6100,
        discount: 10,
        stock: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjoQbzswRimVzRqgb6ljyjnfMpIFqzvWCOQ&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjoQbzswRimVzRqgb6ljyjnfMpIFqzvWCOQ&s'],
        category: categories[0]._id
      },
      {
        name: 'Rose Gold Diamond Ring',
        description: 'Elegant rose gold ring with diamonds, handcrafted in Switzerland.',
        price: 5400,
        discount: 0,
        stock: 5,
        image: 'https://www.heavenlylondon.com/cdn/shop/files/TheTamaraRing_140.jpg?v=1747138625',
        images: ['https://www.heavenlylondon.com/cdn/shop/files/TheTamaraRing_140.jpg?v=1747138625'],
        category: categories[0]._id
      },
      {
        name: 'Minimalist Swiss Gold Ring',
        description: 'Minimalist 18K gold ring inspired by Swiss design.',
        price: 3200,
        discount: 15,
        stock: 7,
        image: 'https://www.candere.com/media/jewellery/images/C001952__1.jpeg',
        images: ['https://www.candere.com/media/jewellery/images/C001952__1.jpeg'],
        category: categories[0]._id
      },

      // ================= EARRINGS =================
      {
        name: 'Swiss Diamond Stud Earrings',
        description: '18K white gold diamond studs, Swiss luxury quality.',
        price: 3600,
        discount: 10,
        stock: 8,
        image: 'https://media.istockphoto.com/id/1289163992/photo/flowers-earrings-isolated.jpg?s=612x612&w=0&k=20&c=7HMQijV5SoKh5zd8l2Dc4qKMBJ9BkQA4QQ_Ln4cCDuU=',
        images: ['https://media.istockphoto.com/id/1289163992/photo/flowers-earrings-isolated.jpg?s=612x612&w=0&k=20&c=7HMQijV5SoKh5zd8l2Dc4qKMBJ9BkQA4QQ_Ln4cCDuU='],
        category: categories[1]._id
      },
      {
        name: 'Luxury Pearl Earrings',
        description: 'Natural pearls with Swiss gold craftsmanship.',
        price: 2900,
        discount: 0,
        stock: 10,
        image: 'https://www.ben-amun.com/cdn/shop/products/22105_1.jpg?v=1724095315',
        images: ['https://www.ben-amun.com/cdn/shop/products/22105_1.jpg?v=1724095315'],
        category: categories[1]._id
      },
      {
        name: 'Rose Gold Drop Earrings',
        description: 'Elegant rose gold drop earrings made in Switzerland.',
        price: 4100,
        discount: 5,
        stock: 6,
        image: 'https://agmesnyc.com/cdn/shop/files/AGMES_Alyce_Earrings_YellowGold.jpg?v=1765999474&width=2776',
        images: ['https://agmesnyc.com/cdn/shop/files/AGMES_Alyce_Earrings_YellowGold.jpg?v=1765999474&width=2776'],
        category: categories[1]._id
      },
      {
        name: 'Diamond Hoop Earrings',
        description: 'Luxury Swiss diamond hoop earrings.',
        price: 5200,
        discount: 0,
        stock: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxvqMaxlMztCqECWIrIm5_sgzmOgwlnpE0Bg&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxvqMaxlMztCqECWIrIm5_sgzmOgwlnpE0Bg&s'],
        category: categories[1]._id
      },
      {
        name: 'Minimalist Gold Earrings',
        description: 'Minimalist Swiss gold earrings for everyday elegance.',
        price: 2100,
        discount: 15,
        stock: 12,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRftSEFOnSJ7UMkRxMQls-q9YYdzHzCp1ozIA&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRftSEFOnSJ7UMkRxMQls-q9YYdzHzCp1ozIA&s'],
        category: categories[1]._id
      },

      // ================= PENDANTS =================
      {
        name: 'Swiss Cross Diamond Pendant',
        description: 'Iconic Swiss cross pendant with diamonds.',
        price: 5100,
        discount: 5,
        stock: 5,
        image: 'https://cdn.shopify.com/s/files/1/2579/7674/files/Ana-Luisa-Jewelry-Necklaces-Pendants-Gold-Pendant-Necklace-Pebble-Gold_b2efe084-908a-4ab5-ba7d-66fee14c61df.jpg?v=1764598549',
        images: ['https://cdn.shopify.com/s/files/1/2579/7674/files/Ana-Luisa-Jewelry-Necklaces-Pendants-Gold-Pendant-Necklace-Pebble-Gold_b2efe084-908a-4ab5-ba7d-66fee14c61df.jpg?v=1764598549'],
        category: categories[2]._id
      },
      {
        name: 'Luxury Sapphire Pendant',
        description: 'Swiss handcrafted pendant with sapphire.',
        price: 6400,
        discount: 0,
        stock: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6yPRAULEwKnNdPncfbupW1X_flhMPDh_19w&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6yPRAULEwKnNdPncfbupW1X_flhMPDh_19w&s'],
        category: categories[2]._id
      },
      {
        name: 'White Gold Diamond Pendant',
        description: '18K white gold pendant with diamonds.',
        price: 7200,
        discount: 10,
        stock: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyfqef6iGTNiK_I-61c3wwxdq_cyOD2EOH7A&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyfqef6iGTNiK_I-61c3wwxdq_cyOD2EOH7A&s'],
        category: categories[2]._id
      },
      {
        name: 'Swiss Heart Gold Pendant',
        description: 'Romantic heart-shaped Swiss gold pendant.',
        price: 3900,
        discount: 0,
        stock: 7,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShiMAjvdckTaPuq1ihzMVjERKXF6DQz5iKDA&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShiMAjvdckTaPuq1ihzMVjERKXF6DQz5iKDA&s'],
        category: categories[2]._id
      },
      {
        name: 'Minimalist Platinum Pendant',
        description: 'Minimalist platinum pendant, Swiss design.',
        price: 5800,
        discount: 15,
        stock: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnQ6rbjoa_5HOBlj5Es0-uAsq2kroXNNPn_w&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnQ6rbjoa_5HOBlj5Es0-uAsq2kroXNNPn_w&s'],
        category: categories[2]._id
      },

      // ================= BRACELETS =================
      {
        name: 'Swiss Gold Bracelet',
        description: '18K gold bracelet with Swiss precision.',
        price: 7800,
        discount: 10,
        stock: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA6lx3f8lMCIV72gxK4UBw6v8RWEfdWjAJbQ&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA6lx3f8lMCIV72gxK4UBw6v8RWEfdWjAJbQ&s'],
        category: categories[3]._id
      },
      {
        name: 'Diamond Tennis Bracelet',
        description: 'Luxury Swiss diamond tennis bracelet.',
        price: 12500,
        discount: 0,
        stock: 2,
        image: 'https://www.alexandani.com/cdn/shop/files/there-cannoli-be-you-bolo-bracelet-1-AO260030WSG.jpg?crop=center&height=2000&v=1765983210&width=2000',
        images: ['https://www.alexandani.com/cdn/shop/files/there-cannoli-be-you-bolo-bracelet-1-AO260030WSG.jpg?crop=center&height=2000&v=1765983210&width=2000'],
        category: categories[3]._id
      },
      {
        name: 'Rose Gold Charm Bracelet',
        description: 'Swiss rose gold charm bracelet.',
        price: 5400,
        discount: 5,
        stock: 5,
        image: 'https://chrono1010.com/images/products/e320fffd-a630-4c9a-a5a9-c4dabb4a538d.png',
        images: ['https://chrono1010.com/images/products/e320fffd-a630-4c9a-a5a9-c4dabb4a538d.png'],
        category: categories[3]._id
      },
      {
        name: 'White Gold Bracelet',
        description: 'Minimalist white gold bracelet.',
        price: 6200,
        discount: 0,
        stock: 6,
        image: 'https://static.e-pandora.ua/31373/conversions/1760711138-webp.webp',
        images: ['https://static.e-pandora.ua/31373/conversions/1760711138-webp.webp'],
        category: categories[3]._id
      },
      {
        name: 'Swiss Platinum Bracelet',
        description: 'Premium platinum bracelet crafted in Switzerland.',
        price: 9900,
        discount: 15,
        stock: 3,
        image: 'https://kymee.in/cdn/shop/files/KBC0041_1_copy.webp?v=1758084101',
        images: ['https://kymee.in/cdn/shop/files/KBC0041_1_copy.webp?v=1758084101'],
        category: categories[3]._id
      },

      // ================= WATCHES =================
      {
        name: 'Patek Philippe Nautilus',
        description: 'Mechanical Swiss watch with sapphire glass.',
        price: 197000,
        discount: 5,
        stock: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSPPIaJ1XQxcfM-vbJHKQE5xrkk-lIVP5YjA&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSPPIaJ1XQxcfM-vbJHKQE5xrkk-lIVP5YjA&s'],
        category: categories[4]._id
      },
      {
        name: 'Jacob & Co Grandfather',
        description: 'Luxury Swiss chronograph with steel case.',
        price: 370000,
        discount: 0,
        stock: 3,
        image: 'https://watches-master.ua/uploads/files/CatalogProducts/images_49124/243ccc.jpeg',
        images: ['https://watches-master.ua/uploads/files/CatalogProducts/images_49124/243ccc.jpeg'],
        category: categories[4]._id
      },
      {
        name: 'Jacob & Co Tourbillion',
        description: 'Elegant Swiss gold dress watch.',
        price: 225000,
        discount: 10,
        stock: 2,
        image: 'https://www.hardybrothers.com.au/cdn/shop/products/jacob-and-co-astronomia-solar-planets-zodiac-44mm-sol.png?v=1692756596&width=960',
        images: ['https://www.hardybrothers.com.au/cdn/shop/products/jacob-and-co-astronomia-solar-planets-zodiac-44mm-sol.png?v=1692756596&width=960'],
        category: categories[4]._id
      },
      {
        name: 'Rolex Datejust',
        description: 'Luxury skeleton mechanical watch made in Switzerland.',
        price: 68000,
        discount: 0,
        stock: 1,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuLex0ETYJdP8picnRSaZq9oQybKTQqFuB3w&s',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuLex0ETYJdP8picnRSaZq9oQybKTQqFuB3w&s'],
        category: categories[4]._id
      },
      {
        name: 'Richard Mille',
        description: 'Minimalist Swiss watch with leather strap.',
        price: 1200000,
        discount: 15,
        stock: 2,
        image: 'https://imagedelivery.net/lyg2LuGO05OELPt1DKJTnw/d9ae768c-c408-4513-c40d-c61fa5d44100/w=400x400',
        images: ['https://imagedelivery.net/lyg2LuGO05OELPt1DKJTnw/d9ae768c-c408-4513-c40d-c61fa5d44100/w=400x400','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrnA4fb5RsFLHxss9o9T7WYGR0l0Up1Nkylg&s'],
        category: categories[4]._id
      }
    ];

    console.log('Creating products...');
    const products = await Product.create(seedProducts);
    console.log(`Created ${products.length} products`);

    console.log(`
      SEED SUCCESSFULLY ENDED!                           
      Users:                                      
      admin@shop.com / admin123 (admin)                
      customer@shop.com / customer123 (customer)       
                                                       
      Categories: ${categories.length}                                     
      Products: ${products.length}                                        
    `);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();