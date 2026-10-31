CREATE TYPE "public"."bicycle_category" AS ENUM('road', 'track', 'vintage-mtb', 'touring', 'city', 'gravel');--> statement-breakpoint
CREATE TABLE "vintage_bicycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"make" varchar(128) NOT NULL,
	"model" varchar(128) NOT NULL,
	"model_year" integer NOT NULL,
	"category" "bicycle_category" NOT NULL,
	"documentation" jsonb NOT NULL,
	"frame_specification" jsonb NOT NULL,
	"drivetrain_specification" jsonb NOT NULL,
	"brake_specification" jsonb NOT NULL,
	"wheel_specification" jsonb NOT NULL,
	"cockpit_specification" jsonb NOT NULL,
	"raw_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "vintage_bicycles_make_model_year_idx" ON "vintage_bicycles" USING btree ("make","model","model_year");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_model_idx" ON "vintage_bicycles" USING btree ("model");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_model_year_idx" ON "vintage_bicycles" USING btree ("model_year");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_category_idx" ON "vintage_bicycles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_documentation_gin_idx" ON "vintage_bicycles" USING gin ("documentation");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_frame_spec_gin_idx" ON "vintage_bicycles" USING gin ("frame_specification");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_drivetrain_spec_gin_idx" ON "vintage_bicycles" USING gin ("drivetrain_specification");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_brake_spec_gin_idx" ON "vintage_bicycles" USING gin ("brake_specification");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_wheel_spec_gin_idx" ON "vintage_bicycles" USING gin ("wheel_specification");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_cockpit_spec_gin_idx" ON "vintage_bicycles" USING gin ("cockpit_specification");--> statement-breakpoint
CREATE INDEX "vintage_bicycles_raw_data_gin_idx" ON "vintage_bicycles" USING gin ("raw_data");