CREATE TABLE "access_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_name" text NOT NULL,
	"rule_type" text NOT NULL,
	"value" text
);
