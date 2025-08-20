CREATE TYPE "public"."crop_type" AS ENUM('paddy', 'vegetables', 'fruits', 'spices', 'other');--> statement-breakpoint
CREATE TYPE "public"."cycle_status" AS ENUM('planned', 'planted', 'growing', 'harvested', 'failed');--> statement-breakpoint
CREATE TYPE "public"."growth_stage" AS ENUM('seedling', 'tillering', 'flowering', 'maturation');--> statement-breakpoint
CREATE TYPE "public"."health_status" AS ENUM('excellent', 'good', 'fair', 'poor');--> statement-breakpoint
CREATE TYPE "public"."season" AS ENUM('maha', 'yala', 'off_season');--> statement-breakpoint
CREATE TYPE "public"."data_source" AS ENUM('manual', 'sensor', 'api', 'weather_station');--> statement-breakpoint
CREATE TYPE "public"."quality_grade" AS ENUM('premium', 'standard', 'low_grade');--> statement-breakpoint
CREATE TYPE "public"."drainage_type" AS ENUM('good', 'moderate', 'poor');--> statement-breakpoint
CREATE TYPE "public"."ownership_type" AS ENUM('owned', 'leased', 'shared');--> statement-breakpoint
CREATE TYPE "public"."soil_type" AS ENUM('clay', 'sandy', 'loam', 'silt', 'rocky');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('beginner', 'intermediate', 'expert');--> statement-breakpoint
CREATE TYPE "public"."knowledge_category" AS ENUM('best_practices', 'pest_control', 'water_management', 'fertilization', 'harvesting', 'soil_management', 'general');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('en', 'si', 'ta');--> statement-breakpoint
CREATE TYPE "public"."irrigation_type" AS ENUM('flood', 'drip', 'sprinkler', 'manual');--> statement-breakpoint
CREATE TYPE "public"."pest_disease_type" AS ENUM('pest', 'disease');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('scheduled', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."resource_category" AS ENUM('seed', 'fertilizer', 'pesticide', 'equipment', 'labor');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('kg', 'liters', 'hours', 'pieces', 'bags');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "crop_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parcel_id" uuid NOT NULL,
	"variety_id" uuid NOT NULL,
	"season" "season" NOT NULL,
	"year" integer NOT NULL,
	"planting_date" date NOT NULL,
	"expected_harvest_date" date NOT NULL,
	"actual_harvest_date" date,
	"status" "cycle_status" DEFAULT 'planned',
	"yield_data" jsonb NOT NULL,
	"cost_data" jsonb,
	"revenue" numeric(12, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crop_varieties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"crop_type" "crop_type" DEFAULT 'paddy' NOT NULL,
	"description" text,
	"growth_period" integer NOT NULL,
	"characteristics" jsonb,
	"suitable_seasons" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "growth_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"stage_name" "growth_stage" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"expected_duration" integer,
	"health_status" "health_status" DEFAULT 'good',
	"observations" text,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "yield_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"prediction_date" date NOT NULL,
	"predicted_yield" numeric(10, 2) NOT NULL,
	"confidence_level" numeric(5, 2),
	"factors" jsonb,
	"model_version" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crop_type" varchar(100) NOT NULL,
	"variety" varchar(255),
	"market" varchar(255) NOT NULL,
	"price_date" date NOT NULL,
	"price_per_kg" numeric(8, 2) NOT NULL,
	"quality" "quality_grade" DEFAULT 'standard',
	"currency" varchar(3) DEFAULT 'LKR',
	"data_source" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weather_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parcel_id" uuid,
	"record_date" date NOT NULL,
	"temperature" jsonb,
	"humidity" numeric(5, 2),
	"rainfall" numeric(8, 2),
	"wind_speed" numeric(6, 2),
	"soil_moisture" numeric(5, 2),
	"data_source" "data_source" DEFAULT 'manual',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farmer_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_area" numeric(10, 4) NOT NULL,
	"ownership_type" "ownership_type" NOT NULL,
	"location" jsonb,
	"registration_number" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "land_parcels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"area" numeric(10, 4) NOT NULL,
	"gps_coordinates" jsonb,
	"soil_type" "soil_type",
	"soil_ph" numeric(3, 1),
	"drainage_type" "drainage_type",
	"water_source" varchar(100),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farmer_id" uuid,
	"type" "alert_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"severity" "alert_severity" DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"action_required" boolean DEFAULT false,
	"related_entity" jsonb,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmer_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farmer_id" uuid NOT NULL,
	"subject" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"priority" "query_priority" DEFAULT 'medium',
	"status" "query_status" DEFAULT 'open',
	"assigned_to" varchar(255),
	"response" text,
	"response_date" timestamp,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20) NOT NULL,
	"address" text,
	"location" jsonb,
	"experience_level" "experience_level" DEFAULT 'beginner',
	"farming_methods" jsonb DEFAULT '[]'::jsonb,
	"communication_channels" jsonb DEFAULT '["sms","email"]'::jsonb,
	"crop_preferences" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "farmers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"category" "knowledge_category" NOT NULL,
	"crop_type" varchar(100),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"language" "language" DEFAULT 'en',
	"author" varchar(255),
	"is_published" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "irrigation_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"irrigation_type" "irrigation_type" DEFAULT 'manual',
	"irrigation_data" jsonb NOT NULL,
	"status" "task_status" DEFAULT 'scheduled',
	"actual_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pest_disease_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"type" "pest_disease_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"severity" "severity" NOT NULL,
	"affected_area" numeric(8, 4),
	"identification_date" date NOT NULL,
	"symptoms" text,
	"treatment_record" jsonb,
	"is_resolved" boolean DEFAULT false,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resource_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"usage_data" jsonb NOT NULL,
	"usage_date" date,
	"purpose" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "resource_category" NOT NULL,
	"unit" "unit_type" NOT NULL,
	"cost_per_unit" numeric(10, 2),
	"supplier" varchar(255),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop_cycles" ADD CONSTRAINT "crop_cycles_parcel_id_land_parcels_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."land_parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crop_cycles" ADD CONSTRAINT "crop_cycles_variety_id_crop_varieties_id_fk" FOREIGN KEY ("variety_id") REFERENCES "public"."crop_varieties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_stages" ADD CONSTRAINT "growth_stages_cycle_id_crop_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."crop_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "yield_predictions" ADD CONSTRAINT "yield_predictions_cycle_id_crop_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."crop_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_data" ADD CONSTRAINT "weather_data_parcel_id_land_parcels_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."land_parcels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farmer_queries" ADD CONSTRAINT "farmer_queries_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "irrigation_schedules" ADD CONSTRAINT "irrigation_schedules_cycle_id_crop_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."crop_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pest_disease_records" ADD CONSTRAINT "pest_disease_records_cycle_id_crop_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."crop_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_usage" ADD CONSTRAINT "resource_usage_cycle_id_crop_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."crop_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_usage" ADD CONSTRAINT "resource_usage_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crop_cycles_parcel_id_idx" ON "crop_cycles" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "crop_cycles_variety_id_idx" ON "crop_cycles" USING btree ("variety_id");--> statement-breakpoint
CREATE INDEX "crop_cycles_season_year_idx" ON "crop_cycles" USING btree ("season","year");--> statement-breakpoint
CREATE INDEX "growth_stages_cycle_id_idx" ON "growth_stages" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "yield_predictions_cycle_id_idx" ON "yield_predictions" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "yield_predictions_prediction_date_idx" ON "yield_predictions" USING btree ("prediction_date");--> statement-breakpoint
CREATE INDEX "market_prices_crop_type_idx" ON "market_prices" USING btree ("crop_type");--> statement-breakpoint
CREATE INDEX "market_prices_price_date_idx" ON "market_prices" USING btree ("price_date");--> statement-breakpoint
CREATE INDEX "market_prices_market_idx" ON "market_prices" USING btree ("market");--> statement-breakpoint
CREATE INDEX "weather_data_parcel_id_idx" ON "weather_data" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "weather_data_record_date_idx" ON "weather_data" USING btree ("record_date");--> statement-breakpoint
CREATE INDEX "farms_farmer_id_idx" ON "farms" USING btree ("farmer_id");--> statement-breakpoint
CREATE INDEX "land_parcels_farm_id_idx" ON "land_parcels" USING btree ("farm_id");--> statement-breakpoint
CREATE INDEX "alerts_farmer_id_idx" ON "alerts" USING btree ("farmer_id");--> statement-breakpoint
CREATE INDEX "alerts_type_idx" ON "alerts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "alerts_is_read_idx" ON "alerts" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "farmer_queries_farmer_id_idx" ON "farmer_queries" USING btree ("farmer_id");--> statement-breakpoint
CREATE INDEX "farmer_queries_status_idx" ON "farmer_queries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_base_category_idx" ON "knowledge_base" USING btree ("category");--> statement-breakpoint
CREATE INDEX "knowledge_base_crop_type_idx" ON "knowledge_base" USING btree ("crop_type");--> statement-breakpoint
CREATE INDEX "knowledge_base_language_idx" ON "knowledge_base" USING btree ("language");--> statement-breakpoint
CREATE INDEX "irrigation_schedules_cycle_id_idx" ON "irrigation_schedules" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "irrigation_schedules_scheduled_date_idx" ON "irrigation_schedules" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "pest_disease_records_cycle_id_idx" ON "pest_disease_records" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "pest_disease_records_type_idx" ON "pest_disease_records" USING btree ("type");--> statement-breakpoint
CREATE INDEX "resource_usage_cycle_id_idx" ON "resource_usage" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "resource_usage_resource_id_idx" ON "resource_usage" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "resources_category_idx" ON "resources" USING btree ("category");