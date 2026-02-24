const { Pool } = require('pg');
const crypto = require('crypto');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function id() { return crypto.randomUUID(); }
function slug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,''); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function picks(arr, min, max) {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

const industries = {
  "Metals & Mining": {
    subs: ["Steel & Iron", "Aluminum", "Copper & Brass", "Precious Metals", "Rare Earth Elements", "Zinc & Lead"],
    products: [
      ["steel coils","steel plates","steel pipes","steel bars","galvanized steel"],
      ["aluminum sheets","aluminum extrusions","aluminum foil","aluminum ingots"],
      ["copper wire","copper tubes","brass fittings","copper cathodes"],
      ["gold bars","silver ingots","platinum wire","palladium catalysts"],
      ["neodymium magnets","cerium oxide","lanthanum","yttrium oxide"],
      ["zinc ingots","lead sheets","zinc alloys","lead-acid components"]
    ],
    certs: ["ISO 9001","ISO 14001","OHSAS 18001","SGS","BV","CE"],
    prefixes: ["MetalPro","SteelWorks","AlloyTech","MineralCorp","OreSource","MetalForge","IronBridge","CopperLine","AluCast","ZincTrade"],
    suffixes: ["Industries","Trading","International","Corp","Group","Manufacturing","Supply","Global","Metals","Resources"]
  },
  "Plastics & Polymers": {
    subs: ["Injection Molding","Extrusion","Blow Molding","Thermoforming","Recycled Plastics","Engineering Plastics"],
    products: [
      ["PET bottles","PP containers","PE films","PVC pipes","polycarbonate sheets"],
      ["plastic pallets","storage bins","automotive parts","medical components"],
      ["silicone seals","rubber gaskets","TPU film","nylon fasteners"],
      ["recycled pellets","rPET flakes","recycled HDPE","upcycled materials"]
    ],
    certs: ["ISO 9001","ISO 14001","FDA","REACH","RoHS","UL"],
    prefixes: ["PolyTech","PlastiForm","MoldPro","ResinWorks","FlexiPack","PolySource","PlastiCo","MoldCraft"],
    suffixes: ["Industries","Solutions","Manufacturing","Corp","International","Plastics","Group","Tech"]
  },
  "Automotive Parts": {
    subs: ["Engine Components","Body Parts","Electrical Systems","Suspension","Braking Systems","Interior Parts"],
    products: [
      ["brake pads","brake rotors","calipers","brake lines"],
      ["headlights","taillights","LED assemblies","wiring harnesses"],
      ["shock absorbers","struts","control arms","ball joints"],
      ["engine mounts","timing belts","fuel injectors","turbochargers"],
      ["seat covers","dashboards","steering wheels","gear knobs"]
    ],
    certs: ["IATF 16949","ISO 9001","ISO 14001","TS 16949","ECE","DOT"],
    prefixes: ["AutoParts","DriveTech","MotorSource","VehiclePro","AutoSupply","GearWorks","BrakeMaster","TurboTech"],
    suffixes: ["Automotive","Parts","Industries","International","Supply","Corp","Manufacturing","Group"]
  },
  "Packaging": {
    subs: ["Corrugated Boxes","Flexible Packaging","Glass Containers","Metal Cans","Labels & Printing","Sustainable Packaging"],
    products: [
      ["corrugated boxes","shipping cartons","mailer boxes","display boxes"],
      ["stand-up pouches","shrink wrap","bubble wrap","stretch film"],
      ["glass bottles","glass jars","cosmetic containers","food jars"],
      ["aluminum cans","tin containers","metal closures","aerosol cans"],
      ["biodegradable bags","compostable packaging","recycled cardboard","kraft paper bags"]
    ],
    certs: ["ISO 9001","FSC","BRC","SQF","ISO 22000","FDA"],
    prefixes: ["PackPro","BoxCraft","WrapTech","ContainerCo","FlexPack","EcoPack","PrintMaster","CartonWorks"],
    suffixes: ["Packaging","Solutions","Industries","International","Corp","Group","Supply","Pack"]
  },
  "Renewable Energy": {
    subs: ["Solar Panels","Wind Turbines","Battery Storage","EV Charging","Inverters","Smart Grid"],
    products: [
      ["monocrystalline panels","polycrystalline panels","solar cells","solar modules"],
      ["wind turbine blades","generators","gearboxes","tower sections"],
      ["lithium batteries","LFP cells","battery management systems","energy storage units"],
      ["EV chargers","charging stations","AC chargers","DC fast chargers"],
      ["solar inverters","micro inverters","hybrid inverters","string inverters"]
    ],
    certs: ["IEC 61215","IEC 61730","UL","CE","TUV","ISO 9001","ISO 14001"],
    prefixes: ["SolarTech","WindPower","GreenEnergy","EcoVolt","SunSource","PowerGrid","CleanTech","VoltAge"],
    suffixes: ["Energy","Power","Solutions","International","Corp","Tech","Systems","Group"]
  },
  "Pharmaceuticals": {
    subs: ["API Manufacturing","Generic Drugs","Nutraceuticals","Medical Devices","Lab Equipment","Veterinary"],
    products: [
      ["active pharmaceutical ingredients","drug intermediates","excipients","capsule shells"],
      ["generic tablets","syringes","IV bags","surgical gloves"],
      ["vitamins","supplements","probiotics","herbal extracts"],
      ["diagnostic kits","blood pressure monitors","thermometers","pulse oximeters"],
      ["centrifuges","microscopes","spectrophotometers","lab reagents"]
    ],
    certs: ["GMP","FDA","WHO-GMP","ISO 13485","CE","ISO 9001","ICH"],
    prefixes: ["PharmaTech","MediSource","BioGen","LifeScience","HealthPro","CureWell","MedSupply","PharmaCore"],
    suffixes: ["Pharmaceuticals","Healthcare","Biotech","Sciences","Medical","Labs","Corp","International"]
  },
  "Building Materials": {
    subs: ["Cement & Concrete","Tiles & Ceramics","Insulation","Roofing","Plumbing","Doors & Windows"],
    products: [
      ["portland cement","ready-mix concrete","concrete blocks","precast panels"],
      ["ceramic tiles","porcelain tiles","mosaic tiles","marble slabs"],
      ["glass wool","rock wool","foam boards","thermal insulation"],
      ["metal roofing","roof tiles","waterproofing membranes","gutters"],
      ["PVC pipes","copper fittings","valves","water tanks"],
      ["aluminum windows","wooden doors","glass panels","steel frames"]
    ],
    certs: ["ISO 9001","CE","ASTM","BS EN","Green Building","LEED"],
    prefixes: ["BuildPro","CementWorks","TileMaster","ConstructCo","RoofTech","InsulPro","GlassCraft","StoneTech"],
    suffixes: ["Building","Materials","Construction","Industries","Supply","International","Corp","Group"]
  },
  "Agriculture & Farming": {
    subs: ["Seeds & Fertilizers","Irrigation","Farm Equipment","Organic Products","Animal Feed","Agrochemicals"],
    products: [
      ["hybrid seeds","organic fertilizers","NPK fertilizers","soil conditioners"],
      ["drip irrigation","sprinkler systems","water pumps","irrigation controllers"],
      ["tractors","harvesters","plows","seeders"],
      ["organic grains","organic spices","dried fruits","natural honey"],
      ["cattle feed","poultry feed","fish feed","feed additives"],
      ["pesticides","herbicides","fungicides","bio-stimulants"]
    ],
    certs: ["ISO 9001","USDA Organic","EU Organic","GlobalGAP","HACCP","ISO 22000"],
    prefixes: ["AgroTech","FarmSource","GreenField","HarvestPro","SeedCo","CropWise","AgriSupply","FertilePro"],
    suffixes: ["Agriculture","Farming","Agro","International","Trading","Corp","Group","Supply"]
  },
  "Furniture & Home": {
    subs: ["Office Furniture","Home Furniture","Outdoor Furniture","Lighting","Kitchen & Bath","Decor"],
    products: [
      ["office desks","ergonomic chairs","filing cabinets","conference tables"],
      ["sofas","beds","dining tables","wardrobes"],
      ["garden furniture","patio sets","outdoor lighting","pergolas"],
      ["LED chandeliers","pendant lights","wall sconces","floor lamps"],
      ["kitchen cabinets","bathroom vanities","countertops","sinks"]
    ],
    certs: ["ISO 9001","FSC","BIFMA","EN 1335","CARB","Greenguard"],
    prefixes: ["FurniCraft","HomePro","DesignWorks","InteriorCo","WoodMaster","LightHouse","DecorTech","CraftLine"],
    suffixes: ["Furniture","Home","Interiors","Design","International","Corp","Industries","Group"]
  },
  "Logistics & Shipping": {
    subs: ["Freight Forwarding","Warehousing","Cold Chain","Customs Brokerage","Last Mile","Container Shipping"],
    products: [
      ["freight services","container shipping","air cargo","rail freight"],
      ["warehouse storage","fulfillment services","pick and pack","inventory management"],
      ["cold storage","refrigerated transport","temperature monitoring","insulated packaging"],
      ["customs clearance","import documentation","export compliance","trade advisory"]
    ],
    certs: ["ISO 9001","AEO","C-TPAT","IATA","GDP","ISO 28000"],
    prefixes: ["LogiPro","FreightWorks","CargoTech","ShipFast","TransGlobal","WareHouse","ColdChain","PortLine"],
    suffixes: ["Logistics","Shipping","Transport","International","Freight","Corp","Solutions","Group"]
  }
};

const countries = [
  { name: "China", code: "CN", cities: ["Shanghai","Shenzhen","Guangzhou","Beijing","Hangzhou","Ningbo","Dongguan","Xiamen","Qingdao","Suzhou"] },
  { name: "India", code: "IN", cities: ["Mumbai","Delhi","Chennai","Bangalore","Ahmedabad","Pune","Hyderabad","Kolkata","Jaipur","Ludhiana"] },
  { name: "Vietnam", code: "VN", cities: ["Ho Chi Minh City","Hanoi","Da Nang","Hai Phong","Binh Duong","Can Tho"] },
  { name: "Turkey", code: "TR", cities: ["Istanbul","Ankara","Izmir","Bursa","Gaziantep","Kocaeli","Adana","Mersin"] },
  { name: "Thailand", code: "TH", cities: ["Bangkok","Chonburi","Rayong","Samut Prakan","Nonthaburi"] },
  { name: "Germany", code: "DE", cities: ["Hamburg","Munich","Frankfurt","Stuttgart","Dusseldorf","Berlin","Cologne"] },
  { name: "South Korea", code: "KR", cities: ["Seoul","Busan","Incheon","Daegu","Ulsan","Changwon"] },
  { name: "Brazil", code: "BR", cities: ["Sao Paulo","Rio de Janeiro","Curitiba","Belo Horizonte","Porto Alegre"] },
  { name: "Mexico", code: "MX", cities: ["Mexico City","Monterrey","Guadalajara","Tijuana","Queretaro","Puebla"] },
  { name: "Indonesia", code: "ID", cities: ["Jakarta","Surabaya","Bandung","Semarang","Medan","Bekasi"] },
  { name: "Poland", code: "PL", cities: ["Warsaw","Krakow","Wroclaw","Poznan","Gdansk","Lodz"] },
  { name: "Malaysia", code: "MY", cities: ["Kuala Lumpur","Penang","Johor Bahru","Shah Alam","Ipoh"] },
  { name: "Taiwan", code: "TW", cities: ["Taipei","Taichung","Kaohsiung","Tainan","Hsinchu"] },
  { name: "Japan", code: "JP", cities: ["Tokyo","Osaka","Nagoya","Yokohama","Fukuoka","Kobe"] },
  { name: "United States", code: "US", cities: ["Houston","Chicago","Los Angeles","Detroit","Atlanta","Dallas","Philadelphia"] },
  { name: "United Kingdom", code: "GB", cities: ["London","Manchester","Birmingham","Leeds","Glasgow","Bristol"] },
  { name: "Italy", code: "IT", cities: ["Milan","Turin","Bologna","Florence","Rome","Naples"] },
  { name: "Spain", code: "ES", cities: ["Barcelona","Madrid","Valencia","Bilbao","Seville","Zaragoza"] },
  { name: "UAE", code: "AE", cities: ["Dubai","Abu Dhabi","Sharjah","Ajman","Ras Al Khaimah"] },
  { name: "Saudi Arabia", code: "SA", cities: ["Riyadh","Jeddah","Dammam","Mecca","Medina"] },
  { name: "Egypt", code: "EG", cities: ["Cairo","Alexandria","Giza","Port Said","Suez"] },
  { name: "South Africa", code: "ZA", cities: ["Johannesburg","Cape Town","Durban","Pretoria","Port Elizabeth"] },
  { name: "Bangladesh", code: "BD", cities: ["Dhaka","Chittagong","Gazipur","Narayanganj","Comilla"] },
  { name: "Pakistan", code: "PK", cities: ["Karachi","Lahore","Faisalabad","Sialkot","Islamabad"] },
];

const regionMap = {
  CN: "Asia Pacific", IN: "Asia Pacific", VN: "Asia Pacific", TH: "Asia Pacific",
  KR: "Asia Pacific", ID: "Asia Pacific", MY: "Asia Pacific", TW: "Asia Pacific",
  JP: "Asia Pacific", BD: "Asia Pacific", PK: "Asia Pacific",
  DE: "Europe", PL: "Europe", GB: "Europe", IT: "Europe", ES: "Europe", TR: "Europe",
  US: "North America", MX: "North America",
  BR: "Latin America",
  AE: "Middle East & Africa", SA: "Middle East & Africa", EG: "Middle East & Africa", ZA: "Middle East & Africa",
};

const revenues = ["$1M-$5M","$5M-$10M","$10M-$50M","$50M-$100M","$100M-$500M","$500M+"];
const employees = [50,100,200,500,1000,2000,5000,10000];
const responseTimes = ["< 24h","24-48h","48-72h","3-5 days"];
const paymentTerms = ["T/T","L/C","D/P","D/A","Western Union","PayPal"];
const exportMarkets = ["North America","Europe","Asia","Middle East","Africa","South America","Oceania"];

const suppliers = [];

for (const [industry, config] of Object.entries(industries)) {
  for (let i = 0; i < 150; i++) {
    const country = pick(countries);
    const city = pick(country.cities);
    const sub = pick(config.subs);
    const prodGroup = pick(config.products);
    const prods = picks(prodGroup, 2, 4);
    const certs = picks(config.certs, 1, 4);
    const prefix = pick(config.prefixes);
    const suffix = pick(config.suffixes);
    const companyName = `${prefix} ${city.split(' ')[0]} ${suffix}`.substring(0, 50);
    const baseSlug = slug(companyName);
    const uniqueSlug = baseSlug + '-' + id().slice(0, 8);
    
    suppliers.push({
      id: id(),
      companyName,
      slug: uniqueSlug,
      country: country.name,
      countryCode: country.code,
      city,
      region: regionMap[country.code] || "Other",
      industry,
      subIndustry: sub,
      products: JSON.stringify(prods),
      certifications: JSON.stringify(certs),
      contactEmail: `info@${slug(prefix)}.com`,
      contactPhone: `+${randInt(1,99)}-${randInt(100,999)}-${randInt(1000,9999)}`,
      website: `https://www.${slug(prefix)}-${slug(city.split(' ')[0])}.com`,
      description: `Leading ${sub.toLowerCase()} supplier based in ${city}, ${country.name}. Specializing in ${prods.slice(0,2).join(' and ')} with ${certs[0]} certification.`,
      employeeCount: pick(employees),
      annualRevenue: pick(revenues),
      yearEstablished: randInt(1985, 2020),
      verified: Math.random() > 0.3,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      reviewCount: randInt(5, 200),
      responseTime: pick(responseTimes),
      minOrderValue: pick([500, 1000, 2000, 5000, 10000]),
      currency: "USD",
      paymentTerms: JSON.stringify(picks(paymentTerms, 1, 3)),
      exportMarkets: JSON.stringify(picks(exportMarkets, 2, 5)),
      logoUrl: null,
    });
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let count = 0;
    for (const s of suppliers) {
      await client.query(
        `INSERT INTO "Supplier" (id, "companyName", slug, country, "countryCode", city, region, industry, "subIndustry", products, certifications, "contactEmail", "contactPhone", website, description, "employeeCount", "annualRevenue", "yearEstablished", verified, rating, "reviewCount", "responseTime", "minOrderValue", currency, "paymentTerms", "exportMarkets", "logoUrl", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,NOW(),NOW())
         ON CONFLICT (slug) DO NOTHING`,
        [s.id, s.companyName, s.slug, s.country, s.countryCode, s.city, s.region, s.industry, s.subIndustry, s.products, s.certifications, s.contactEmail, s.contactPhone, s.website, s.description, s.employeeCount, s.annualRevenue, s.yearEstablished, s.verified, s.rating, s.reviewCount, s.responseTime, s.minOrderValue, s.currency, s.paymentTerms, s.exportMarkets, s.logoUrl]
      );
      count++;
    }
    await client.query('COMMIT');
    console.log(`Seeded ${count} suppliers across ${Object.keys(industries).length} new industries`);
    
    const res = await pool.query('SELECT industry, COUNT(*) as count FROM "Supplier" GROUP BY industry ORDER BY count DESC');
    console.log('\nFinal distribution:');
    console.log(res.rows);
    
    const total = await pool.query('SELECT COUNT(*) FROM "Supplier"');
    console.log(`\nTotal suppliers: ${total.rows[0].count}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', e.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
