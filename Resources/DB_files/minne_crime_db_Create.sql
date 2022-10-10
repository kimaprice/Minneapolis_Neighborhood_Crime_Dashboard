-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "neighborhooddata" (
    "neighborhoodid" int   NOT NULL,
    "neighborhood" varchar   NOT NULL,
    CONSTRAINT "pk_neighborhooddata" PRIMARY KEY (
        "neighborhoodid"
     )
);

CREATE TABLE "crimedata" (
    "id" serial   NOT NULL,
    "neighborhoodid" int   NOT NULL,
    "occurred_date" date   NOT NULL,
	"monthyear" varchar   NOT NULL,
	"month" int   NOT NULL,
	"year" int   NOT NULL,
    "offense_cat" varchar   NOT NULL,
    "offense" varchar   NOT NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    "crime_count" float   NOT NULL,
    CONSTRAINT "pk_crimedata" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "demographicdata" (
    "id" serial   NOT NULL,
    "neighborhoodid" int   NOT NULL,
    "demoid" int   NOT NULL,
    "percent" float   NOT NULL,
    CONSTRAINT "pk_demographicdata" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "democat" (
    "demoid" int   NOT NULL,
    "demographic" varchar   NOT NULL,
    "category" varchar   NOT NULL,
    CONSTRAINT "pk_democat" PRIMARY KEY (
        "demoid"
     )
);

ALTER TABLE "crimedata" ADD CONSTRAINT "fk_crimedata_neighborhoodid" FOREIGN KEY("neighborhoodid")
REFERENCES "neighborhooddata" ("neighborhoodid");

ALTER TABLE "demographicdata" ADD CONSTRAINT "fk_demographicdata_neighborhoodid" FOREIGN KEY("neighborhoodid")
REFERENCES "neighborhooddata" ("neighborhoodid");

ALTER TABLE "demographicdata" ADD CONSTRAINT "fk_demographicdata_demoid" FOREIGN KEY("demoid")
REFERENCES "democat" ("demoid");

