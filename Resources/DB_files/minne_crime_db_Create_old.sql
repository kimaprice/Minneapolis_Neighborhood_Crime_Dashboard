-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "neighborhoodData" (
    "neighborhoodID" int   NOT NULL,
    "neighborhood" varchar   NOT NULL,
    CONSTRAINT "pk_neighborhoodData" PRIMARY KEY (
        "neighborhoodID"
     )
);

CREATE TABLE "crimeData" (
    "id" serial   NOT NULL,
    "neighborhoodID" int   NOT NULL,
    "occurred_date" date   NOT NULL,
    "offense_cat" varchar   NOT NULL,
    "offense" varchar   NOT NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    "crime_count" float   NOT NULL,
    CONSTRAINT "pk_crimeData" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "demographicData" (
    "id" serial   NOT NULL,
    "neighborhoodID" int   NOT NULL,
    "demoID" int   NOT NULL,
    "percent" float   NOT NULL,
    CONSTRAINT "pk_demographicData" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "demoCat" (
    "demoID" int   NOT NULL,
    "demographic" varchar   NOT NULL,
    "category" varchar   NOT NULL,
    CONSTRAINT "pk_demoCat" PRIMARY KEY (
        "demoID"
     )
);

ALTER TABLE "crimeData" ADD CONSTRAINT "fk_crimeData_neighborhoodID" FOREIGN KEY("neighborhoodID")
REFERENCES "neighborhoodData" ("neighborhoodID");

ALTER TABLE "demographicData" ADD CONSTRAINT "fk_demographicData_neighborhoodID" FOREIGN KEY("neighborhoodID")
REFERENCES "neighborhoodData" ("neighborhoodID");

ALTER TABLE "demographicData" ADD CONSTRAINT "fk_demographicData_demoID" FOREIGN KEY("demoID")
REFERENCES "demoCat" ("demoID");

