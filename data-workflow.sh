#!/bin/bash
set -ev

DATA=./raw-data/orig/2019-01-11
OUT=./raw-data/data/2019-01-11
mkdir -p $DATA $OUT

npm run build:cli

EN_LIBRARY="$DATA/My EndNote Library_FAMRI_REFERENCE_GROUP_final.xml"
AUTHOR_MAPPING="$DATA/FAMRI_grants_2002-2017_01-9-19.xlsx"

./node_modules/.bin/reflib "$EN_LIBRARY" -o json -f $OUT/all_publications.json
./dist/dvl-fw-plugin/famri extract-authors "$AUTHOR_MAPPING" $OUT/authors.csv

./dist/dvl-fw-plugin/famri limit-pubs $OUT/all_publications.json $OUT/authors.csv $OUT/author_publications.json
./dist/dvl-fw-plugin/famri extract-coauth-gexf $OUT/author_publications.json $OUT/author_coauth.gexf

# Open in GEPHI and update the layout, save as $OUT/author_coauth_layout.gexf
cp $OUT/author_coauth.gexf $OUT/author_coauth_layout.gexf

./dist/dvl-fw-plugin/famri create-database $OUT/author_publications.json $OUT/author_coauth_layout.gexf $OUT/database.yml
./dist/dvl-fw-plugin/famri export-project $OUT/database.yml $OUT/project.yml
./dist/dvl-fw-plugin/famri export-db-as-csv $OUT/database.yml $OUT/database
