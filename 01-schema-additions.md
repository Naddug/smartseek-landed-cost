# Prisma Schema Additions

Aşağıdaki modelleri mevcut `prisma/schema.prisma` dosyandaki modellerin altına yapıştır.

```prisma
model Supplier {
  id              String   @id @default(cuid())
  companyName     String
  slug            String   @unique
  country         String
  countryCode     String
  city            String
  region          String?
  industry        String
  subIndustry     String?
  products        String
  certifications  String?
  contactEmail    String
  contactPhone    String?
  website         String?
  description     String
  employeeCount   Int?
  annualRevenue   String?
  yearEstablished Int
  verified        Boolean  @default(false)
  rating          Float    @default(0)
  reviewCount     Int      @default(0)
  responseTime    String?
  minOrderValue   Float?
  currency        String   @default("USD")
  paymentTerms    String?
  exportMarkets   String?
  logoUrl         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  leads Lead[]
  rfqs  RFQ[]

  @@index([country])
  @@index([industry])
  @@index([companyName])
}

model Lead {
  id         String   @id @default(cuid())
  supplierId String
  supplier   Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  buyerName       String
  buyerEmail      String
  buyerPhone      String?
  buyerCompany    String?
  message         String
  productInterest String?
  status          String   @default("new")
  source          String   @default("supplier_page")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([supplierId])
  @@index([buyerEmail])
  @@index([status])
}

model RFQ {
  id         String    @id @default(cuid())
  supplierId String?
  supplier   Supplier? @relation(fields: [supplierId], references: [id], onDelete: SetNull)

  buyerName       String
  buyerEmail      String
  buyerPhone      String?
  buyerCompany    String?
  buyerCountry    String?

  productName     String
  productCategory String?
  quantity        Int
  unit            String    @default("pcs")
  targetPrice     Float?
  currency        String    @default("USD")
  specifications  String?

  incoterm        String?
  destinationPort String?
  deliveryDate    String?

  status    String   @default("pending")
  notes     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([supplierId])
  @@index([buyerEmail])
  @@index([status])
}
```

## Sonra çalıştır:

```bash
npx prisma migrate dev --name add-supplier-lead-rfq
npx prisma generate
```
