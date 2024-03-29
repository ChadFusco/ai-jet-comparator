DROP TABLE IF EXISTS jets;

CREATE TABLE public.jets (
  name TEXT PRIMARY KEY NOT NULL,
  wingspan DECIMAL(65,30),
  engine_qty INT,
  year_manufactured INT
);

COPY jets FROM '/home/ubuntu/ai-jet-comparator/etl/jet_facts.csv' WITH (FORMAT CSV, HEADER true);


-- Execute this file from the command line by typing:
-- psql jetai < etl/loadIn.sql
-- to create the tables in the jets database.
