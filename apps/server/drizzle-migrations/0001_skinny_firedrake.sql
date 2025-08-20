CREATE TYPE "public"."attachment_type" AS ENUM('image', 'document', 'video');--> statement-breakpoint
CREATE TYPE "public"."communication_channel" AS ENUM('sms', 'email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."crop_preference" AS ENUM('paddy', 'vegetables', 'fruits');--> statement-breakpoint
CREATE TYPE "public"."district_enum" AS ENUM('galle', 'colombo', 'mathara');--> statement-breakpoint
CREATE TYPE "public"."farming_method" AS ENUM('organic', 'conventional', 'integrated');--> statement-breakpoint
CREATE TYPE "public"."photo_type" AS ENUM('field_photo', 'pest_damage', 'growth_stage');--> statement-breakpoint
CREATE TYPE "public"."province_enum" AS ENUM('southern', 'western');--> statement-breakpoint
CREATE TYPE "public"."suitable_season" AS ENUM('maha', 'yala', 'off_season');--> statement-breakpoint
CREATE TYPE "public"."tag" AS ENUM('beginner_friendly', 'advanced', 'seasonal');--> statement-breakpoint
ALTER TABLE "farmers" ALTER COLUMN "farming_methods" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "farmers" ALTER COLUMN "communication_channels" SET DEFAULT '["sms"]'::jsonb;--> statement-breakpoint
ALTER TABLE "farmers" ALTER COLUMN "communication_channels" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "farmers" ALTER COLUMN "crop_preferences" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "farmers" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "farmers" ADD CONSTRAINT "farmers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;