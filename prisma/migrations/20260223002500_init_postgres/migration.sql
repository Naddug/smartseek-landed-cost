-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "landed_cost_calculations" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "product_name" TEXT NOT NULL,
    "hs_code" TEXT,
    "category" TEXT,
    "origin_country" TEXT NOT NULL,
    "destination_country" TEXT NOT NULL,
    "origin_port" TEXT,
    "destination_port" TEXT,
    "product_cost" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "incoterm" TEXT,
    "shipping_method" TEXT NOT NULL,
    "container_type" TEXT,
    "weight" DECIMAL(65,30),
    "volume" DECIMAL(65,30),
    "dimensions" JSONB,
    "calculation_inputs" JSONB,
    "calculation_result" JSONB,
    "calculation_notes" JSONB,
    "benchmark_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landed_cost_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landed_cost_scenarios" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scenario_type" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landed_cost_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_benchmarks" (
    "id" SERIAL NOT NULL,
    "hs_code" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "destination_country" TEXT NOT NULL,
    "shipping_method" TEXT NOT NULL,
    "container_type" TEXT,
    "percentile_25" DECIMAL(65,30) NOT NULL,
    "median" DECIMAL(65,30) NOT NULL,
    "percentile_75" DECIMAL(65,30) NOT NULL,
    "sample_size" INTEGER NOT NULL DEFAULT 0,
    "data_source" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_customs_configs" (
    "id" SERIAL NOT NULL,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "customs_valuation_method" TEXT NOT NULL,
    "default_vat_rate" DECIMAL(65,30),
    "de_minimis_threshold" DECIMAL(65,30),
    "additional_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_customs_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "industry" TEXT NOT NULL,
    "subIndustry" TEXT,
    "products" TEXT NOT NULL,
    "certifications" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "website" TEXT,
    "description" TEXT NOT NULL,
    "employeeCount" INTEGER,
    "annualRevenue" TEXT,
    "yearEstablished" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "responseTime" TEXT,
    "minOrderValue" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentTerms" TEXT,
    "exportMarkets" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "buyerCompany" TEXT,
    "message" TEXT NOT NULL,
    "productInterest" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'supplier_page',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RFQ" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerPhone" TEXT,
    "buyerCompany" TEXT,
    "buyerCountry" TEXT,
    "productName" TEXT NOT NULL,
    "productCategory" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "targetPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "specifications" TEXT,
    "incoterm" TEXT,
    "destinationPort" TEXT,
    "deliveryDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landed_cost_calculations_user_id_idx" ON "landed_cost_calculations"("user_id");

-- CreateIndex
CREATE INDEX "landed_cost_calculations_hs_code_idx" ON "landed_cost_calculations"("hs_code");

-- CreateIndex
CREATE INDEX "landed_cost_calculations_origin_country_destination_country_idx" ON "landed_cost_calculations"("origin_country", "destination_country");

-- CreateIndex
CREATE INDEX "landed_cost_calculations_created_at_idx" ON "landed_cost_calculations"("created_at");

-- CreateIndex
CREATE INDEX "landed_cost_scenarios_user_id_idx" ON "landed_cost_scenarios"("user_id");

-- CreateIndex
CREATE INDEX "landed_cost_scenarios_scenario_type_idx" ON "landed_cost_scenarios"("scenario_type");

-- CreateIndex
CREATE INDEX "market_benchmarks_hs_code_idx" ON "market_benchmarks"("hs_code");

-- CreateIndex
CREATE INDEX "market_benchmarks_origin_country_destination_country_idx" ON "market_benchmarks"("origin_country", "destination_country");

-- CreateIndex
CREATE INDEX "market_benchmarks_last_updated_idx" ON "market_benchmarks"("last_updated");

-- CreateIndex
CREATE UNIQUE INDEX "market_benchmarks_hs_code_origin_country_destination_countr_key" ON "market_benchmarks"("hs_code", "origin_country", "destination_country", "shipping_method", "container_type");

-- CreateIndex
CREATE UNIQUE INDEX "country_customs_configs_country_code_key" ON "country_customs_configs"("country_code");

-- CreateIndex
CREATE INDEX "country_customs_configs_country_code_idx" ON "country_customs_configs"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_slug_key" ON "Supplier"("slug");

-- CreateIndex
CREATE INDEX "Supplier_country_idx" ON "Supplier"("country");

-- CreateIndex
CREATE INDEX "Supplier_industry_idx" ON "Supplier"("industry");

-- CreateIndex
CREATE INDEX "Supplier_companyName_idx" ON "Supplier"("companyName");

-- CreateIndex
CREATE INDEX "Lead_supplierId_idx" ON "Lead"("supplierId");

-- CreateIndex
CREATE INDEX "Lead_buyerEmail_idx" ON "Lead"("buyerEmail");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "RFQ_supplierId_idx" ON "RFQ"("supplierId");

-- CreateIndex
CREATE INDEX "RFQ_buyerEmail_idx" ON "RFQ"("buyerEmail");

-- CreateIndex
CREATE INDEX "RFQ_status_idx" ON "RFQ"("status");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RFQ" ADD CONSTRAINT "RFQ_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

