require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Models
const Seller = require("../model/Seller");
const Category = require("../model/Category");
const HomeCategory = require("../model/HomeCategory");
const Product = require("../model/Product");
const Deal = require("../model/Deal");

// Domains & Utils
const HomeCategorySection = require("../domain/HomeCategorySection");
const cloudinary = require("../utils/cloudinary");

const defaultUrl = "mongodb+srv://inbafreakz_db_user:tb868bQdyiV4HDdO@cluster0.guxcmfs.mongodb.net/myDatabase?retryWrites=true&w=majority";

// Helper to upload image to Cloudinary (with fallback)
const uploadToCloudinary = async (url, folder = "inbamart") => {
  try {
    console.log(`Uploading to Cloudinary: ${url}`);
    const res = await cloudinary.uploader.upload(url, { folder });
    console.log(`Uploaded! Cloudinary URL: ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.log(`Cloudinary upload failed, falling back to original URL: ${err.message}`);
    return url;
  }
};

// Data definition
const categoryData = [
  // 1. Electronics - Mobiles
  {
    id: "mobiles",
    name: "Mobiles",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "InbaPhone 15 Pro",
        description: "Experience absolute high-definition mobile processing. Built-in 128GB storage, quad-pixel focus camera, high refresh-rate display.",
        mrpPrice: 79999,
        sellingPrice: 69999,
        color: "Black",
        discountPercent: 12,
        quantity: 50,
        size: "M",
        images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"]
      },
      {
        title: "UltraClear Tempered Glass Guard",
        description: "Premium tempered glass screen guard offering complete scratch protection and anti-fingerprint coating.",
        mrpPrice: 499,
        sellingPrice: 199,
        color: "White",
        discountPercent: 60,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"]
      },
      {
        title: "Sleek Silicon Protective Case",
        description: "Flexible gel protective phone back cover in attractive colors, featuring anti-drop corner cushions.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Pink",
        discountPercent: 60,
        quantity: 120,
        size: "S",
        images: ["https://images.unsplash.com/photo-1580870013141-3b13c510006a?w=600"]
      },
      {
        title: "Fast Charging USB-C Adapter",
        description: "High speed 20W power adapter, equipped with dual port charging for quick smartphone juice-ups.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "Blue",
        discountPercent: 53,
        quantity: 100,
        size: "M",
        images: ["https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=600"]
      },
      {
        title: "Gold Plated Phone Stand Holder",
        description: "Robust metal desk phone holder stand, with adjustable height settings and non-slip rubber grips.",
        mrpPrice: 2999,
        sellingPrice: 1299,
        color: "Gold",
        discountPercent: 56,
        quantity: 80,
        size: "L",
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"]
      }
    ]
  },
  // 2. Electronics - Laptops
  {
    id: "laptops",
    name: "Laptops",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "InbaBook Air Thin Laptop",
        description: "High performance lightweight laptop, with 16GB memory, 512GB SSD storage, and pre-installed OS.",
        mrpPrice: 94999,
        sellingPrice: 84999,
        color: "Black",
        discountPercent: 10,
        quantity: 30,
        size: "L",
        images: ["https://images.unsplash.com/photo-1496181130204-755241544e3f?w=600"]
      },
      {
        title: "Shockproof Water-Resistant Sleeve",
        description: "Padded sleeve carry bag for laptops up to 15.6 inches, protecting against rain, drops, and scratches.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Pink",
        discountPercent: 60,
        quantity: 110,
        size: "S",
        images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600"]
      },
      {
        title: "Ergonomic Adjustable Laptop Stand",
        description: "Foldable aluminum riser stand for better laptop cooling ventilation and neck posture comfort.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "White",
        discountPercent: 55,
        quantity: 95,
        size: "M",
        images: ["https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600"]
      },
      {
        title: "Wireless USB Optical Mouse",
        description: "Comfortable ergonomic wireless mouse with dynamic scroll settings, powered by an AA battery.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "Blue",
        discountPercent: 53,
        quantity: 130,
        size: "M",
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600"]
      },
      {
        title: "Multi-Port USB-C Hub Adapter",
        description: "Premium gold finish Type-C adapter dongle featuring HDMI, SD card reader slots, and USB-A connections.",
        mrpPrice: 3499,
        sellingPrice: 1899,
        color: "Gold",
        discountPercent: 45,
        quantity: 60,
        size: "L",
        images: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600"]
      }
    ]
  },
  // 3. Electronics - Smart Watches
  {
    id: "smart-watches",
    name: "Smart Watches",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "Elite Watch Series 9",
        description: "Flagship smart watch tracking active heart-rate, SPO2 levels, sleep statistics, and customized workouts.",
        mrpPrice: 24999,
        sellingPrice: 19999,
        color: "Black",
        discountPercent: 20,
        quantity: 45,
        size: "L",
        images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"]
      },
      {
        title: "Silicon Breathable Sports Band",
        description: "Comfortable dynamic silicon strap for smart watches, sweat-resistant for outdoor workouts.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Pink",
        discountPercent: 60,
        quantity: 140,
        size: "S",
        images: ["https://images.unsplash.com/photo-1579811216948-6f57c19376a5?w=600"]
      },
      {
        title: "Tempered Watch Screen Case Guard",
        description: "Ultra-thin high transparency smart watch tempered protection film preserving touch responsiveness.",
        mrpPrice: 499,
        sellingPrice: 199,
        color: "White",
        discountPercent: 60,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]
      },
      {
        title: "Luxury Stainless Steel Link Loop",
        description: "Brushed gold metal lock replacement strap for smart watches, perfect for business meetings.",
        mrpPrice: 2999,
        sellingPrice: 1299,
        color: "Gold",
        discountPercent: 56,
        quantity: 70,
        size: "M",
        images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600"]
      },
      {
        title: "Magnetic Wireless Charging Dock",
        description: "Fast-charging smart watch desktop charging stand dock powered by an integrated USB cable.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "Blue",
        discountPercent: 55,
        quantity: 90,
        size: "M",
        images: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600"]
      }
    ]
  },
  // 4. Electronics - Headphones
  {
    id: "headphones",
    name: "Headphones",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "Wireless ANC Over-Ear Headset",
        description: "Immersive over-ear headphones with active noise cancellation (ANC), premium bass response, and 30-hour battery life.",
        mrpPrice: 7999,
        sellingPrice: 3999,
        color: "Black",
        discountPercent: 50,
        quantity: 80,
        size: "L",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]
      },
      {
        title: "Wired Bass-Boosted Earphones",
        description: "Durable wired in-ear earphones with integrated microphone, delivering crystal-clear calls and heavy bass.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Red",
        discountPercent: 60,
        quantity: 200,
        size: "S",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"]
      },
      {
        title: "Silicone Earphone Case Cover",
        description: "Shockproof silicone protective cover case compatible with wireless earphone charging cases, with a keychain clip.",
        mrpPrice: 499,
        sellingPrice: 199,
        color: "Pink",
        discountPercent: 60,
        quantity: 180,
        size: "S",
        images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"]
      },
      {
        title: "Ergonomic Memory Foam Cushions",
        description: "Ultra-soft replacements for headphone ear pads, crafted with cool gel memory foam for long listening comfort.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "White",
        discountPercent: 53,
        quantity: 95,
        size: "M",
        images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600"]
      },
      {
        title: "Golden Accent Premium Audio Cable",
        description: "Gold-plated auxiliary audio cable for wired headphone conversions, offering lossless audio streaming.",
        mrpPrice: 2499,
        sellingPrice: 1199,
        color: "Gold",
        discountPercent: 52,
        quantity: 120,
        size: "M",
        images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"]
      }
    ]
  },
  // 5. Electronics - Speakers
  {
    id: "speakers",
    name: "Speakers",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "Heavy Bass Bluetooth Party Speaker",
        description: "Powerful party speaker with dynamic RGB light show, built-in subwoofers, and karaoke microphone input options.",
        mrpPrice: 12999,
        sellingPrice: 7999,
        color: "Black",
        discountPercent: 38,
        quantity: 40,
        size: "XL",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"]
      },
      {
        title: "Compact Portable Travel Speaker",
        description: "Small pocket-sized wireless speaker, shockproof and dust-resistant, delivering great outdoor sound.",
        mrpPrice: 2999,
        sellingPrice: 1499,
        color: "Blue",
        discountPercent: 50,
        quantity: 110,
        size: "M",
        images: ["https://images.unsplash.com/photo-1589256469067-ea99122bbec4?w=600"]
      },
      {
        title: "Mini Shower Waterproof Speaker",
        description: "IPX7 waterproof portable speaker, equipped with a strong suction cup mount for bathrooms and pools.",
        mrpPrice: 999,
        sellingPrice: 499,
        color: "Yellow",
        discountPercent: 50,
        quantity: 130,
        size: "S",
        images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"]
      },
      {
        title: "Protective Mesh Storage Case",
        description: "Durable hardshell carrying case built specifically to organize and protect portable Bluetooth speakers.",
        mrpPrice: 799,
        sellingPrice: 349,
        color: "Pink",
        discountPercent: 56,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=600"]
      },
      {
        title: "Golden Grill Soundbar Speaker",
        description: "Sleek soundbar speaker for home theaters, with a premium gold metallic front mesh and deep bass ports.",
        mrpPrice: 4999,
        sellingPrice: 2499,
        color: "Gold",
        discountPercent: 50,
        quantity: 65,
        size: "L",
        images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"]
      }
    ]
  },
  // 6. Electronics - TV
  {
    id: "tv",
    name: "Television",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "UltraHD Smart LED TV 55",
        description: "4K smart television offering high dynamic range display, Dolby surround audio, and built-in streaming apps.",
        mrpPrice: 49999,
        sellingPrice: 34999,
        color: "Black",
        discountPercent: 30,
        quantity: 20,
        size: "XXL",
        images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"]
      },
      {
        title: "Adjustable TV Wall Mount Bracket",
        description: "Heavy-duty steel wall mount bracket supporting screens from 32 to 65 inches, with variable tilt options.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "Black",
        discountPercent: 55,
        quantity: 90,
        size: "L",
        images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"]
      },
      {
        title: "Smart Voice Replacement Remote",
        description: "Voice-activated universal TV remote control compatible with major smart TV models and streaming platforms.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "White",
        discountPercent: 60,
        quantity: 120,
        size: "S",
        images: ["https://images.unsplash.com/photo-1552975084-6e027cd345c2?w=600"]
      },
      {
        title: "High Speed 4K Gold HDMI Cable",
        description: "Braided 6.6ft HDMI cable featuring gold-plated conductors to support high-resolution visual streams.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "Gold",
        discountPercent: 62,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1557063673-0493e05d49ef?w=600"]
      },
      {
        title: "RGB LED TV Backlight Strip",
        description: "USB-powered light strips that attach to the back of the TV, reducing eye strain and adding atmospheric glow.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "Blue",
        discountPercent: 53,
        quantity: 110,
        size: "M",
        images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600"]
      }
    ]
  },
  // 7. Electronics - Cameras
  {
    id: "cameras",
    name: "Cameras",
    parentName: "Electronics",
    parentId: "electronics",
    products: [
      {
        title: "Pro DSLR Creator Camera",
        description: "Professional level DSLR camera capturing 24MP images and 4K video, complete with a versatile starter lens kit.",
        mrpPrice: 69999,
        sellingPrice: 54999,
        color: "Black",
        discountPercent: 21,
        quantity: 15,
        size: "XL",
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"]
      },
      {
        title: "Heavy-Duty Aluminum Tripod Stand",
        description: "Adjustable lightweight aluminum camera tripod with a 3-way pan head and durable carrying bag.",
        mrpPrice: 2999,
        sellingPrice: 1299,
        color: "Black",
        discountPercent: 56,
        quantity: 80,
        size: "L",
        images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"]
      },
      {
        title: "Lens Cleaning Microfiber Kit",
        description: "Professional blower, spray bottle, and soft microfiber cleaning cloths to maintain lens transparency.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "White",
        discountPercent: 62,
        quantity: 170,
        size: "S",
        images: ["https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600"]
      },
      {
        title: "Camera Padded Sling Travel Bag",
        description: "Ergonomic protective sling pack bag designed to safely hold camera bodies, additional lenses, and cards.",
        mrpPrice: 2499,
        sellingPrice: 1199,
        color: "Blue",
        discountPercent: 52,
        quantity: 90,
        size: "M",
        images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600"]
      },
      {
        title: "Golden Vintage Shoulder Strap",
        description: "Classic retro styled neck shoulder strap, universally compatible with DSLR and mirrorless cameras.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Gold",
        discountPercent: 60,
        quantity: 120,
        size: "S",
        images: ["https://images.unsplash.com/photo-1500643752441-4da900dfabcd?w=600"]
      }
    ]
  },
  // 8. Home & Kitchen - Lamps & Lighting
  {
    id: "lamps-lighting",
    name: "Lamps & Lighting",
    parentName: "Home & Kitchen",
    parentId: "home_kitchen",
    products: [
      {
        title: "Sunset Projection LED Light",
        description: "Vibrant sunset glow lamp, perfect for room aesthetics, sunset projection photography, and cozy background mood lighting.",
        mrpPrice: 899,
        sellingPrice: 399,
        color: "Pink",
        discountPercent: 55,
        quantity: 80,
        size: "S",
        images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"]
      },
      {
        title: "Minimalist Wooden Desk Study Lamp",
        description: "Sleek wooden desk lamp with adjustable arm and warm fabric cover. Ideal for study tables, readers, and work offices.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "White",
        discountPercent: 55,
        quantity: 45,
        size: "M",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"]
      },
      {
        title: "Vintage Industrial Edison Pendant Light",
        description: "Retro black metal frame pendant lighting fixture. Perfect for dining tables, kitchen islands, corridors, and cafe decors.",
        mrpPrice: 2999,
        sellingPrice: 1499,
        color: "Black",
        discountPercent: 50,
        quantity: 60,
        size: "L",
        images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"]
      },
      {
        title: "Smart RGB LED Color-Changing Floor Lamp",
        description: "Floor corner lamp with 16 million colors, custom presets, audio sound sync modes, and smart controller app integrations.",
        mrpPrice: 5999,
        sellingPrice: 2999,
        color: "Blue",
        discountPercent: 50,
        quantity: 35,
        size: "XL",
        images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600"]
      },
      {
        title: "Luxury Golden Crystal Circular Chandelier",
        description: "Modern circular gold plating ceiling chandelier fixture. Featuring premium hanging crystals and adjustable temperature LED rings.",
        mrpPrice: 14999,
        sellingPrice: 8999,
        color: "Gold",
        discountPercent: 40,
        quantity: 15,
        size: "XXL",
        images: ["https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=600"]
      }
    ]
  },
  // 9. Home & Kitchen - Home Decor
  {
    id: "home-decor",
    name: "Home Decor",
    parentName: "Home & Kitchen",
    parentId: "home_kitchen",
    products: [
      {
        title: "Ceramic Flower Vase Set",
        description: "Elegant ceramic vase set featuring a textured surface design, adding character to tables and display shelves.",
        mrpPrice: 2499,
        sellingPrice: 1199,
        color: "White",
        discountPercent: 52,
        quantity: 50,
        size: "M",
        images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600"]
      },
      {
        title: "Wall Mount Floating Shelves",
        description: "Minimalist black finish wooden floating shelves, ideal to display small plants, books, or framed pictures.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "Black",
        discountPercent: 55,
        quantity: 85,
        size: "M",
        images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600"]
      },
      {
        title: "Luxury Golden Metal Leaf Wall Art",
        description: "Stunning wall hanging decorative sculpture featuring gold-finished metallic leaves, perfect for living room walls.",
        mrpPrice: 7999,
        sellingPrice: 3999,
        color: "Gold",
        discountPercent: 50,
        quantity: 30,
        size: "XL",
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600"]
      },
      {
        title: "Artificial Indoor Potted Plant",
        description: "Life-like artificial green plant potted in a clean ceramic pot, bringing natural vibrance without watering maintenance.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Green",
        discountPercent: 60,
        quantity: 120,
        size: "S",
        images: ["https://images.unsplash.com/photo-1501004318641-72ee46df725f?w=600"]
      },
      {
        title: "Velvet Throw Pillow Cover Set",
        description: "Luxurious ruby red velvet throw pillow cushion covers, equipped with hidden zipper closures.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "Red",
        discountPercent: 62,
        quantity: 140,
        size: "S",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600"]
      }
    ]
  },
  // 10. Home & Kitchen - Kitchenware
  {
    id: "kitchenware",
    name: "Kitchenware",
    parentName: "Home & Kitchen",
    parentId: "home_kitchen",
    products: [
      {
        title: "Non-Stick Tri-Ply Fry Pan",
        description: "Heavy-duty non-stick pan with a tri-ply stainless steel body, ensuring quick and uniform heat distribution.",
        mrpPrice: 2999,
        sellingPrice: 1999,
        color: "Black",
        discountPercent: 33,
        quantity: 40,
        size: "L",
        images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600"]
      },
      {
        title: "Airtight Glass Storage Spice Jars",
        description: "Set of 6 glass containers with airtight bamboo lids, ideal for clean pantry organization of spices and herbs.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "White",
        discountPercent: 53,
        quantity: 90,
        size: "M",
        images: ["https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600"]
      },
      {
        title: "Gold Plated Stainless Steel Cutlery Set",
        description: "Elegant 24-piece dinner cutlery flatware set, polished with a gold coating, packaged in a premium gift case.",
        mrpPrice: 5999,
        sellingPrice: 2999,
        color: "Gold",
        discountPercent: 50,
        quantity: 50,
        size: "L",
        images: ["https://images.unsplash.com/photo-1543510473-ac2c35329a28?w=600"]
      },
      {
        title: "Silicone Baking Mat Sheet",
        description: "Reusable non-stick food-grade silicone baking mat, ideal for lining baking trays and rolling dough.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Red",
        discountPercent: 60,
        quantity: 110,
        size: "S",
        images: ["https://images.unsplash.com/photo-1581683705068-ca8f49fc7f45?w=600"]
      },
      {
        title: "Ceramic Coffee Mug Set of 2",
        description: "Handcrafted yellow ceramic coffee mugs, featuring wide comfortable handles and thick insulated walls.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "Yellow",
        discountPercent: 62,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600"]
      }
    ]
  },
  // 11. Fashion - Women Ethnic
  {
    id: "women-sarees",
    name: "Women Ethnic Wear",
    parentName: "Fashion",
    parentId: "fashion",
    products: [
      {
        title: "Traditional Banarasi Silk Saree",
        description: "Woven banarasi art silk saree featuring gold brocade zari work details, perfect for weddings and festivals.",
        mrpPrice: 9999,
        sellingPrice: 4999,
        color: "Red",
        discountPercent: 50,
        quantity: 35,
        size: "L",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"]
      },
      {
        title: "Embroidered Georgette Anarkali Kurti",
        description: "Floor length georgette kurti dress with detailed thread embroidery and soft inner lining.",
        mrpPrice: 3999,
        sellingPrice: 1999,
        color: "Pink",
        discountPercent: 50,
        quantity: 70,
        size: "M",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600"]
      },
      {
        title: "Cotton Printed Dailywear Salwar Suit",
        description: "Soft printed pure cotton suit material, complete with a matching cotton pants salwar and printed dupatta.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "Yellow",
        discountPercent: 55,
        quantity: 90,
        size: "M",
        images: ["https://images.unsplash.com/photo-1608748010899-18f300247112?w=600"]
      },
      {
        title: "Golden Border Silk Dupatta",
        description: "Lustrous banarasi style art silk dupatta, highlighted with a gold thread border to elevate simple suits.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Gold",
        discountPercent: 60,
        quantity: 130,
        size: "S",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600"]
      },
      {
        title: "Ethnic Embroidered Blouse Piece",
        description: "Soft raw silk unstitched designer blouse piece fabric, containing detailed gold floral borders.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "Green",
        discountPercent: 62,
        quantity: 110,
        size: "S",
        images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600"]
      }
    ]
  },
  // 12. Fashion - Footwear
  {
    id: "footwear",
    name: "Footwear",
    parentName: "Fashion",
    parentId: "fashion",
    products: [
      {
        title: "Prime Running Cushioned Sneakers",
        description: "Comfortable athletic sports running shoes with breathable mesh and thick responsive cushion insoles.",
        mrpPrice: 4999,
        sellingPrice: 2499,
        color: "White",
        discountPercent: 50,
        quantity: 75,
        size: "L",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]
      },
      {
        title: "Slip-on Light Memory Foam Sandals",
        description: "Comfortable daily wear sandals containing contoured orthotic footbeds and soft synthetic leather straps.",
        mrpPrice: 1999,
        sellingPrice: 899,
        color: "Black",
        discountPercent: 55,
        quantity: 95,
        size: "M",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600"]
      },
      {
        title: "Casual Synthetic Leather Loafers",
        description: "Classic blue loafers with a synthetic suede finish and soft rubber driving soles.",
        mrpPrice: 2999,
        sellingPrice: 1499,
        color: "Blue",
        discountPercent: 50,
        quantity: 60,
        size: "M",
        images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600"]
      },
      {
        title: "Luxury Velvet Block Heels",
        description: "Comfortable low block heels finished with a luxurious red velvet strap, suitable for party nights.",
        mrpPrice: 3999,
        sellingPrice: 1999,
        color: "Red",
        discountPercent: 50,
        quantity: 50,
        size: "M",
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"]
      },
      {
        title: "Breathable Daily Wear Flip Flops",
        description: "Soft flexible rubber daily flip flops in green colorways, lightweight for summer strolls.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Green",
        discountPercent: 60,
        quantity: 140,
        size: "S",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600"]
      }
    ]
  },
  // 13. Fashion - Accessories
  {
    id: "accessories",
    name: "Fashion Accessories",
    parentName: "Fashion",
    parentId: "fashion",
    products: [
      {
        title: "Anti-Glare Polarized Sunglasses",
        description: "Retro styled aviator sunglasses featuring polarized anti-glare protection lenses.",
        mrpPrice: 2499,
        sellingPrice: 1199,
        color: "Black",
        discountPercent: 52,
        quantity: 80,
        size: "M",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"]
      },
      {
        title: "Vegan Leather Crossbody Handbag",
        description: "Premium vegan leather sling bag for women, with adjustable buckle strap and gold accent hardware details.",
        mrpPrice: 3999,
        sellingPrice: 1999,
        color: "Pink",
        discountPercent: 50,
        quantity: 45,
        size: "L",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"]
      },
      {
        title: "Adjustable Genuine Leather Belt",
        description: "Timeless brown genuine leather belt with a solid brass buckle closure system.",
        mrpPrice: 1499,
        sellingPrice: 699,
        color: "Yellow", // Representing Brown in colors
        discountPercent: 53,
        quantity: 100,
        size: "M",
        images: ["https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?w=600"]
      },
      {
        title: "Silk Floral Hair Band Scarf",
        description: "Multi-functional silk printed scarf band, perfect for styling hair bun accents or purse handles.",
        mrpPrice: 799,
        sellingPrice: 299,
        color: "Green",
        discountPercent: 62,
        quantity: 150,
        size: "S",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600"]
      },
      {
        title: "Golden Charm Wrist Bracelet",
        description: "Classic gold link wrist bracelet containing delicate dynamic star and moon shaped charms.",
        mrpPrice: 999,
        sellingPrice: 399,
        color: "Gold",
        discountPercent: 60,
        quantity: 120,
        size: "S",
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]
      }
    ]
  }
];

const seed = async () => {
  if (mongoose.connection.readyState === 0) {
    const url = process.env.MONGODB_URI || defaultUrl;
    console.log("Connecting to MongoDB at", url);
    try {
      await mongoose.connect(url);
      console.log("Connected to MongoDB!");
    } catch (dbErr) {
      console.log(`Primary DB connection failed, trying local fallback: ${dbErr.message}`);
      await mongoose.connect("mongodb://localhost:27017/inba-mart");
      console.log("Connected to Local MongoDB!");
    }
  } else {
    console.log("Using existing active database connection.");
  }

  // 1. Seed / Fetch Seller
  let seller = await Seller.findOne();
  if (!seller) {
    console.log("Seeding default Seller...");
    const hashedPassword = await bcrypt.hash("sellerpassword", 10);
    seller = new Seller({
      sellerName: "Inba Mart Prime Store",
      email: "seller@inbamart.com",
      password: hashedPassword,
      mobile: "9876543210",
      GSTIN: "GSTIN22AAAAA1111A1Z1",
      accountStatus: "ACTIVE"
    });
    await seller.save();
    console.log("Default seller created: seller@inbamart.com / sellerpassword");
  }

  // 2. Clear existing categories, products, and deals to avoid duplicates
  console.log("Clearing existing Categories, HomeCategories, Products, and Deals...");
  await Category.deleteMany({});
  await HomeCategory.deleteMany({});
  await Product.deleteMany({});
  await Deal.deleteMany({});

  // 3. Seed Root (Level 0) Parent Categories
  console.log("Seeding root categories...");
  const rootCatMap = {
    "Electronics": await Category.create({ name: "Electronics", categoryId: "electronics", level: 0 }),
    "Fashion": await Category.create({ name: "Fashion", categoryId: "fashion", level: 0 }),
    "Home & Kitchen": await Category.create({ name: "Home & Kitchen", categoryId: "home_kitchen", level: 0 })
  };

  // 4. Loop through categories configuration to seed levels 1, 2, 3 and products
  for (const catConfig of categoryData) {
    console.log(`Processing category tree for: ${catConfig.name} (${catConfig.id})...`);
    
    // Level 1 Subcategory
    const parentRootDoc = rootCatMap[catConfig.parentName];
    const lvl1Doc = await Category.create({
      name: catConfig.name,
      categoryId: catConfig.id,
      parentCategory: parentRootDoc._id,
      level: 1
    });

    // Level 2 Subcategory
    const lvl2Doc = await Category.create({
      name: `${catConfig.name} L2`,
      categoryId: `${catConfig.id}-l2`,
      parentCategory: lvl1Doc._id,
      level: 2
    });

    // Level 3 Subcategory (Products point to this level in the schema query flow)
    const lvl3Doc = await Category.create({
      name: `${catConfig.name} L3`,
      categoryId: `${catConfig.id}-l3`,
      parentCategory: lvl2Doc._id,
      level: 3
    });

    // Seed Products
    console.log(`Seeding ${catConfig.products.length} products for category: ${catConfig.name}...`);
    for (const prod of catConfig.products) {
      const seededImages = [];
      for (const img of prod.images) {
        const cloudUrl = await uploadToCloudinary(img, "inbamart_products");
        seededImages.push(cloudUrl);
      }

      await Product.create({
        title: prod.title,
        description: prod.description,
        mrpPrice: prod.mrpPrice,
        sellingPrice: prod.sellingPrice,
        color: prod.color,
        discountPercent: prod.discountPercent,
        quantity: prod.quantity,
        size: prod.size,
        category: lvl3Doc._id,
        images: seededImages,
        seller: seller._id
      });
    }
  }

  // 5. Seed Home Section Graphics Categories
  console.log("Seeding Home Category graphics for user portal previews...");
  
  // Electric Categories List (header menu shortcuts)
  const electricsList = [
    { name: "Laptops", categoryId: "laptops", image: "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=300" },
    { name: "Mobiles", categoryId: "mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" },
    { name: "Smart Watches", categoryId: "smart-watches", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300" },
    { name: "Headphones", categoryId: "headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
    { name: "Speakers", categoryId: "speakers", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300" },
    { name: "Television", categoryId: "tv", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300" },
    { name: "Cameras", categoryId: "cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300" }
  ];

  for (const item of electricsList) {
    const imgUrl = await uploadToCloudinary(item.image, "inbamart_categories");
    await HomeCategory.create({
      name: item.name,
      categoryId: item.categoryId,
      Image: imgUrl,
      section: HomeCategorySection.ELECTRIC_CATEGORIES
    });
  }

  // Shop By Categories List (circular listings)
  const shopList = [
    { name: "Lamps & Lightings", categoryId: "lamps-lighting", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300" },
    { name: "Home Decor", categoryId: "home-decor", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300" },
    { name: "Kitchenware", categoryId: "kitchenware", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300" },
    { name: "Women Ethnic", categoryId: "women-sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    { name: "Footwear", categoryId: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
    { name: "Fashion Accessories", categoryId: "accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300" }
  ];

  for (const item of shopList) {
    const imgUrl = await uploadToCloudinary(item.image, "inbamart_categories");
    await HomeCategory.create({
      name: item.name,
      categoryId: item.categoryId,
      Image: imgUrl,
      section: HomeCategorySection.SHOP_BY_CATEGORIES
    });
  }

  // Grid Categories List (deals grid layout)
  const gridList = [
    { name: "Gaming Laptops Deal", categoryId: "laptops", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500" },
    { name: "Premium Audio Gear", categoryId: "headphones", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500" },
    { name: "Chandelier Luxury", categoryId: "lamps-lighting", image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=500" },
    { name: "Kitchen Essentials", categoryId: "kitchenware", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500" }
  ];

  for (const item of gridList) {
    const imgUrl = await uploadToCloudinary(item.image, "inbamart_categories");
    await HomeCategory.create({
      name: item.name,
      categoryId: item.categoryId,
      Image: imgUrl,
      section: HomeCategorySection.GRID
    });
  }

  // Home Deals Carousel Lists
  const dealList = [
    { name: "Audio Gear Offers", categoryId: "headphones", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", discount: 50 },
    { name: "Mobile Flash Deals", categoryId: "mobiles", image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=500", discount: 12 },
    { name: "Footwear Blockbuster", categoryId: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", discount: 50 },
    { name: "Premium Lighting Sale", categoryId: "lamps-lighting", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", discount: 55 }
  ];

  for (const item of dealList) {
    const imgUrl = await uploadToCloudinary(item.image, "inbamart_categories");
    const hc = await HomeCategory.create({
      name: item.name,
      categoryId: item.categoryId,
      Image: imgUrl,
      section: HomeCategorySection.DEALS
    });
    // Link to Deal
    await Deal.create({
      discout: item.discount,
      category: hc._id
    });
  }

  console.log("Database seeded successfully with all 13 categories and products!");
};

if (require.main === module) {
  const url = process.env.MONGODB_URI || defaultUrl;
  console.log("Connecting to MongoDB at", url);
  mongoose.connect(url)
    .then(() => seed())
    .then(() => {
      console.log("Seeding CLI finished.");
      process.exit(0);
    })
    .catch(err => {
      console.error("Seeding script error:", err);
      process.exit(1);
    });
}

module.exports = seed;
