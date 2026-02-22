-- CreateTable
CREATE TABLE "landed_cost_calculations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "product_cost" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "incoterm" TEXT,
    "shipping_method" TEXT NOT NULL,
    "container_type" TEXT,
    "weight" DECIMAL,
    "volume" DECIMAL,
    "dimensions" JSONB,
    "calculation_inputs" JSONB,
    "calculation_result" JSONB,
    "calculation_notes" JSONB,
    "benchmark_data" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "landed_cost_scenarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scenario_type" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "market_benchmarks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hs_code" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "destination_country" TEXT NOT NULL,
    "shipping_method" TEXT NOT NULL,
    "container_type" TEXT,
    "percentile_25" DECIMAL NOT NULL,
    "median" DECIMAL NOT NULL,
    "percentile_75" DECIMAL NOT NULL,
    "sample_size" INTEGER NOT NULL DEFAULT 0,
    "data_source" TEXT,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "country_customs_configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "customs_valuation_method" TEXT NOT NULL,
    "default_vat_rate" DECIMAL,
    "de_minimis_threshold" DECIMAL,
    "additional_config" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
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
CREATE UNIQUE INDEX "market_benchmarks_hs_code_origin_country_destination_country_shipping_method_container_type_key" ON "market_benchmarks"("hs_code", "origin_country", "destination_country", "shipping_method", "container_type");

-- CreateIndex
CREATE UNIQUE INDEX "country_customs_configs_country_code_key" ON "country_customs_configs"("country_code");

-- CreateIndex
CREATE INDEX "country_customs_configs_country_code_idx" ON "country_customs_configs"("country_code");
