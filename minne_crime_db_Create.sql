-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "neighborhood" (
    "neighborhood_id" int   NOT NULL,
    "neighborhood" varchar   NOT NULL,
    CONSTRAINT "pk_neighborhood" PRIMARY KEY (
        "neighborhood_id"
     )
);

CREATE TABLE "crime_data" (
    "id" serial   NOT NULL,
    "neighborhood_id" int   NOT NULL,
    "occurred_date" date   NOT NULL,
    "offense_cat" varchar   NOT NULL,
    "offense" varchar   NOT NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    "crime_count" float   NOT NULL,
    CONSTRAINT "pk_crime_data" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "demographic_data" (
    "id" serial   NOT NULL,
    "neighborhood_id" int   NOT NULL,
    "demo_id" int   NOT NULL,
    "percent" float   NOT NULL,
    CONSTRAINT "pk_demographic_data" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "demo_cat" (
    "demo_id" int   NOT NULL,
    "demographic" varchar   NOT NULL,
    "category" varchar   NOT NULL,
    CONSTRAINT "pk_demo_cat" PRIMARY KEY (
        "demo_id"
     )
);

ALTER TABLE "crime_data" ADD CONSTRAINT "fk_crime_data_neighborhood_id" FOREIGN KEY("neighborhood_id")
REFERENCES "neighborhood" ("neighborhood_id");

ALTER TABLE "demographic_data" ADD CONSTRAINT "fk_demographic_data_neighborhood_id" FOREIGN KEY("neighborhood_id")
REFERENCES "neighborhood" ("neighborhood_id");

ALTER TABLE "demographic_data" ADD CONSTRAINT "fk_demographic_data_demo_id" FOREIGN KEY("demo_id")
REFERENCES "demo_cat" ("demo_id");

