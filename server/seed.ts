import { db } from "./db";
import { supplierShortlists } from "@shared/schema";

const sampleShortlists = [
  {
    title: "Top Electronics Manufacturers in Shenzhen",
    category: "Electronics",
    isPremium: true,
    suppliers: [
      {
        name: "Shenzhen Tech Solutions Co., Ltd.",
        location: "Shenzhen, Guangdong, China",
        rating: 4.8,
        moq: "500 units",
        leadTime: "15-20 days",
        certifications: ["ISO 9001", "CE", "RoHS"],
        specialties: ["Consumer Electronics", "IoT Devices", "Smart Home"],
        yearsInBusiness: 12,
        contactEmail: "info@shenzhentechsol.com"
      },
      {
        name: "Guangdong Electronics Manufacturing",
        location: "Shenzhen, Guangdong, China",
        rating: 4.6,
        moq: "1000 units",
        leadTime: "20-25 days",
        certifications: ["ISO 9001", "FCC", "CE"],
        specialties: ["PCB Assembly", "Custom Electronics", "OEM Services"],
        yearsInBusiness: 15,
        contactEmail: "sales@gdelectronics.com"
      },
      {
        name: "Innovate Electronics Ltd.",
        location: "Shenzhen, Guangdong, China",
        rating: 4.9,
        moq: "300 units",
        leadTime: "12-18 days",
        certifications: ["ISO 9001", "UL", "CE", "RoHS"],
        specialties: ["Wearables", "Audio Equipment", "Mobile Accessories"],
        yearsInBusiness: 8,
        contactEmail: "export@innovateelec.com"
      }
    ]
  },
  {
    title: "Verified Textile Manufacturers - Bangladesh",
    category: "Textiles",
    isPremium: true,
    suppliers: [
      {
        name: "Dhaka Garments International",
        location: "Dhaka, Bangladesh",
        rating: 4.7,
        moq: "2000 pieces",
        leadTime: "30-35 days",
        certifications: ["BSCI", "WRAP", "Oeko-Tex"],
        specialties: ["Knitwear", "T-shirts", "Sustainable Fashion"],
        yearsInBusiness: 20,
        contactEmail: "orders@dhakagarments.com"
      },
      {
        name: "Bengal Textiles Ltd.",
        location: "Chittagong, Bangladesh",
        rating: 4.5,
        moq: "3000 pieces",
        leadTime: "35-40 days",
        certifications: ["GOTS", "Fair Trade", "SA8000"],
        specialties: ["Organic Cotton", "Denim", "Home Textiles"],
        yearsInBusiness: 18,
        contactEmail: "info@bengaltextiles.com"
      },
      {
        name: "Apex Fashion Manufacturing",
        location: "Dhaka, Bangladesh",
        rating: 4.8,
        moq: "1500 pieces",
        leadTime: "25-30 days",
        certifications: ["BSCI", "SEDEX", "Oeko-Tex"],
        specialties: ["Fast Fashion", "Activewear", "Children's Clothing"],
        yearsInBusiness: 14,
        contactEmail: "export@apexfashion.com"
      }
    ]
  },
  {
    title: "Premium Coffee Suppliers - South America",
    category: "Food & Beverage",
    isPremium: true,
    suppliers: [
      {
        name: "Colombian Coffee Exporters S.A.",
        location: "Medellín, Colombia",
        rating: 4.9,
        moq: "500 kg",
        leadTime: "10-15 days",
        certifications: ["Fair Trade", "Organic", "Rainforest Alliance"],
        specialties: ["Arabica Beans", "Single Origin", "Specialty Coffee"],
        yearsInBusiness: 25,
        contactEmail: "sales@colombiancoffee.com"
      },
      {
        name: "Brazilian Coffee Traders Ltd.",
        location: "São Paulo, Brazil",
        rating: 4.6,
        moq: "1000 kg",
        leadTime: "15-20 days",
        certifications: ["UTZ", "4C", "ISO 22000"],
        specialties: ["Robusta", "Arabica", "Bulk Supply"],
        yearsInBusiness: 30,
        contactEmail: "export@brazilcoffee.com"
      },
      {
        name: "Peruvian Highlands Coffee Co.",
        location: "Lima, Peru",
        rating: 4.8,
        moq: "300 kg",
        leadTime: "12-18 days",
        certifications: ["Organic", "Fair Trade", "Bird Friendly"],
        specialties: ["High Altitude Coffee", "Organic", "Direct Trade"],
        yearsInBusiness: 12,
        contactEmail: "info@peruhighlands.com"
      }
    ]
  },
  {
    title: "Industrial Machinery Suppliers - Germany",
    category: "Machinery",
    isPremium: true,
    suppliers: [
      {
        name: "Deutsche Maschinenbau GmbH",
        location: "Stuttgart, Germany",
        rating: 4.9,
        moq: "1 unit",
        leadTime: "60-90 days",
        certifications: ["ISO 9001", "CE", "TÜV"],
        specialties: ["CNC Machines", "Precision Tools", "Industrial Automation"],
        yearsInBusiness: 45,
        contactEmail: "verkauf@deutschemaschinenbau.de"
      },
      {
        name: "Bavaria Engineering Solutions",
        location: "Munich, Germany",
        rating: 4.7,
        moq: "1 unit",
        leadTime: "45-60 days",
        certifications: ["ISO 9001", "CE", "DIN"],
        specialties: ["Packaging Machinery", "Food Processing", "Custom Engineering"],
        yearsInBusiness: 38,
        contactEmail: "export@bavariaeng.de"
      },
      {
        name: "Rhine Industrial Equipment",
        location: "Frankfurt, Germany",
        rating: 4.8,
        moq: "1 unit",
        leadTime: "50-75 days",
        certifications: ["ISO 9001", "ATEX", "CE"],
        specialties: ["Material Handling", "Conveyor Systems", "Warehouse Automation"],
        yearsInBusiness: 32,
        contactEmail: "info@rhineind.com"
      }
    ]
  },
  {
    title: "Beauty & Cosmetics ODM Manufacturers - Korea",
    category: "Beauty & Personal Care",
    isPremium: true,
    suppliers: [
      {
        name: "K-Beauty Manufacturing Co.",
        location: "Seoul, South Korea",
        rating: 4.8,
        moq: "1000 units",
        leadTime: "30-45 days",
        certifications: ["GMP", "ISO 22716", "KFDA"],
        specialties: ["Skincare", "K-Beauty", "Private Label"],
        yearsInBusiness: 16,
        contactEmail: "odm@kbeautymanuf.com"
      },
      {
        name: "Seoul Cosmetics Lab",
        location: "Seoul, South Korea",
        rating: 4.9,
        moq: "500 units",
        leadTime: "25-35 days",
        certifications: ["GMP", "ISO 22716", "Organic"],
        specialties: ["Clean Beauty", "R&D", "Custom Formulation"],
        yearsInBusiness: 10,
        contactEmail: "lab@seoulcosmetics.com"
      },
      {
        name: "Busan Beauty Industries",
        location: "Busan, South Korea",
        rating: 4.7,
        moq: "2000 units",
        leadTime: "35-50 days",
        certifications: ["GMP", "ISO 22716", "Halal"],
        specialties: ["Makeup", "Hair Care", "Mass Production"],
        yearsInBusiness: 22,
        contactEmail: "export@busanbeauty.com"
      }
    ]
  },
  {
    title: "Furniture Manufacturers - Vietnam",
    category: "Furniture",
    isPremium: true,
    suppliers: [
      {
        name: "Vietnam Wood Crafts Ltd.",
        location: "Ho Chi Minh City, Vietnam",
        rating: 4.7,
        moq: "50 pieces",
        leadTime: "40-50 days",
        certifications: ["FSC", "ISO 9001", "CARB"],
        specialties: ["Wooden Furniture", "Indoor Furniture", "Custom Design"],
        yearsInBusiness: 18,
        contactEmail: "sales@vnwoodcrafts.com"
      },
      {
        name: "Hanoi Furniture Manufacturing",
        location: "Hanoi, Vietnam",
        rating: 4.6,
        moq: "100 pieces",
        leadTime: "45-60 days",
        certifications: ["FSC", "BSCI", "ISO 14001"],
        specialties: ["Outdoor Furniture", "Rattan", "Export Quality"],
        yearsInBusiness: 25,
        contactEmail: "export@hanoifurniture.com"
      },
      {
        name: "Da Nang Home Decor Co.",
        location: "Da Nang, Vietnam",
        rating: 4.8,
        moq: "30 pieces",
        leadTime: "35-45 days",
        certifications: ["FSC", "ISO 9001", "SVLK"],
        specialties: ["Contemporary Design", "Sustainable Materials", "OEM/ODM"],
        yearsInBusiness: 12,
        contactEmail: "info@dananghomedecor.com"
      }
    ]
  },
  {
    title: "Pharmaceutical Raw Material Suppliers - India",
    category: "Pharmaceuticals",
    isPremium: true,
    suppliers: [
      {
        name: "Mumbai Pharma Ingredients Pvt Ltd",
        location: "Mumbai, India",
        rating: 4.8,
        moq: "100 kg",
        leadTime: "20-30 days",
        certifications: ["GMP", "ISO 9001", "WHO-GMP", "FDA"],
        specialties: ["API", "Excipients", "Pharmaceutical Intermediates"],
        yearsInBusiness: 28,
        contactEmail: "export@mumbaipharma.com"
      },
      {
        name: "Gujarat Chemical Solutions",
        location: "Ahmedabad, India",
        rating: 4.7,
        moq: "250 kg",
        leadTime: "25-35 days",
        certifications: ["GMP", "ISO 9001", "USFDA"],
        specialties: ["Active Ingredients", "Contract Manufacturing", "R&D"],
        yearsInBusiness: 22,
        contactEmail: "sales@gujaratchem.com"
      },
      {
        name: "Hyderabad Life Sciences Ltd.",
        location: "Hyderabad, India",
        rating: 4.9,
        moq: "50 kg",
        leadTime: "15-25 days",
        certifications: ["GMP", "ISO 9001", "EDQM", "WHO-GMP"],
        specialties: ["Fine Chemicals", "Custom Synthesis", "Regulatory Support"],
        yearsInBusiness: 16,
        contactEmail: "info@hyderabadlifesci.com"
      }
    ]
  },
  {
    title: "Automotive Parts Manufacturers - Mexico",
    category: "Automotive",
    isPremium: true,
    suppliers: [
      {
        name: "Monterrey Auto Components S.A.",
        location: "Monterrey, Mexico",
        rating: 4.7,
        moq: "500 units",
        leadTime: "30-40 days",
        certifications: ["IATF 16949", "ISO 9001", "ISO 14001"],
        specialties: ["Engine Parts", "Transmission Components", "Tier 1 Supplier"],
        yearsInBusiness: 24,
        contactEmail: "ventas@monterreyauto.com"
      },
      {
        name: "Tijuana Manufacturing Corp",
        location: "Tijuana, Mexico",
        rating: 4.6,
        moq: "1000 units",
        leadTime: "35-45 days",
        certifications: ["IATF 16949", "ISO 9001"],
        specialties: ["Electrical Components", "Wiring Harnesses", "Assembly"],
        yearsInBusiness: 19,
        contactEmail: "export@tijuanamanuf.com"
      },
      {
        name: "Guadalajara Precision Parts",
        location: "Guadalajara, Mexico",
        rating: 4.8,
        moq: "300 units",
        leadTime: "25-35 days",
        certifications: ["IATF 16949", "ISO 9001", "VDA 6.3"],
        specialties: ["Machined Parts", "Stamping", "Just-in-Time Delivery"],
        yearsInBusiness: 15,
        contactEmail: "info@gdlprecision.com"
      }
    ]
  },
  {
    title: "Sustainable Packaging Suppliers - Europe",
    category: "Packaging",
    isPremium: true,
    suppliers: [
      {
        name: "Nordic Eco Pack AB",
        location: "Stockholm, Sweden",
        rating: 4.9,
        moq: "5000 units",
        leadTime: "20-30 days",
        certifications: ["FSC", "PEFC", "ISO 14001", "Cradle to Cradle"],
        specialties: ["Biodegradable Packaging", "Paper Products", "Sustainability Consulting"],
        yearsInBusiness: 11,
        contactEmail: "info@nordicecopack.se"
      },
      {
        name: "Amsterdam Green Solutions B.V.",
        location: "Amsterdam, Netherlands",
        rating: 4.8,
        moq: "3000 units",
        leadTime: "25-35 days",
        certifications: ["FSC", "ISO 9001", "Compostable"],
        specialties: ["Compostable Materials", "Food Packaging", "Custom Design"],
        yearsInBusiness: 8,
        contactEmail: "sales@amsterdamgreen.nl"
      },
      {
        name: "Berlin Sustainable Packaging GmbH",
        location: "Berlin, Germany",
        rating: 4.7,
        moq: "10000 units",
        leadTime: "30-40 days",
        certifications: ["FSC", "ISO 14001", "Blue Angel"],
        specialties: ["Recycled Materials", "Retail Packaging", "Brand Packaging"],
        yearsInBusiness: 14,
        contactEmail: "kontakt@berlinsustainpack.de"
      }
    ]
  },
  {
    title: "Smart Home Devices - Taiwan",
    category: "Electronics",
    isPremium: true,
    suppliers: [
      {
        name: "Taiwan IoT Solutions Ltd.",
        location: "Taipei, Taiwan",
        rating: 4.8,
        moq: "200 units",
        leadTime: "18-25 days",
        certifications: ["CE", "FCC", "RoHS", "UL"],
        specialties: ["Smart Sensors", "Home Automation", "IoT Platforms"],
        yearsInBusiness: 10,
        contactEmail: "sales@taiwaniot.com"
      },
      {
        name: "Hsinchu Electronics Manufacturing",
        location: "Hsinchu, Taiwan",
        rating: 4.9,
        moq: "500 units",
        leadTime: "20-28 days",
        certifications: ["ISO 9001", "CE", "FCC", "BSMI"],
        specialties: ["ODM Services", "WiFi Devices", "Voice Control"],
        yearsInBusiness: 16,
        contactEmail: "odm@hsinchuelectronics.tw"
      },
      {
        name: "Kaohsiung Smart Tech Co.",
        location: "Kaohsiung, Taiwan",
        rating: 4.7,
        moq: "300 units",
        leadTime: "22-30 days",
        certifications: ["CE", "FCC", "RoHS"],
        specialties: ["Smart Lighting", "Security Systems", "Energy Management"],
        yearsInBusiness: 12,
        contactEmail: "export@kaohsiungsmart.com"
      }
    ]
  },
  {
    title: "Organic Food Suppliers - USA",
    category: "Food & Beverage",
    isPremium: true,
    suppliers: [
      {
        name: "California Organic Farms Inc.",
        location: "Fresno, CA, USA",
        rating: 4.8,
        moq: "500 lbs",
        leadTime: "5-10 days",
        certifications: ["USDA Organic", "Non-GMO", "Global G.A.P."],
        specialties: ["Fresh Produce", "Almonds", "Dried Fruits"],
        yearsInBusiness: 32,
        contactEmail: "sales@caorganicfarms.com"
      },
      {
        name: "Pacific Northwest Organics LLC",
        location: "Portland, OR, USA",
        rating: 4.9,
        moq: "300 lbs",
        leadTime: "7-12 days",
        certifications: ["USDA Organic", "Fair Trade", "Regenerative Organic"],
        specialties: ["Berries", "Apples", "Sustainable Farming"],
        yearsInBusiness: 18,
        contactEmail: "info@pnworganics.com"
      },
      {
        name: "Texas Natural Foods Co.",
        location: "Austin, TX, USA",
        rating: 4.7,
        moq: "1000 lbs",
        leadTime: "10-15 days",
        certifications: ["USDA Organic", "Kosher", "Gluten-Free"],
        specialties: ["Grains", "Legumes", "Bulk Foods"],
        yearsInBusiness: 25,
        contactEmail: "export@txnaturalfoods.com"
      }
    ]
  }
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...");
  
  try {
    // Clear existing shortlists
    await db.delete(supplierShortlists);
    console.log("✓ Cleared existing shortlists");
    
    // Insert sample shortlists
    for (const shortlist of sampleShortlists) {
      await db.insert(supplierShortlists).values(shortlist);
      console.log(`✓ Created: ${shortlist.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${sampleShortlists.length} supplier shortlists!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
