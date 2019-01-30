#!/bin/bash
set -ev
shopt -s expand_aliases

EN_LIBRARY="./raw-data/orig/2019-01-30/My EndNote Library_FAMRI_REFERENCE_GROUP_1-30-19.xml"
AUTHOR_MAPPING="./raw-data/orig/2019-01-09/FAMRI_grants_2002-2017_01-9-19.xlsx"
OUT=./raw-data/data/2019-01-30
mkdir -p $DATA $OUT

alias famri="node --max_old_space_size=5000 ./dist/dvl-fw-plugin/famri"
alias reflib="./node_modules/.bin/reflib"

npm run build:cli

reflib "$EN_LIBRARY" -o json -f $OUT/all_publications.json
famri extract-authors "$AUTHOR_MAPPING" $OUT/authors.csv

famri limit-pubs $OUT/all_publications.json $OUT/authors.csv $OUT/author_publications.json
famri extract-coauth-gexf $OUT/author_publications.json $OUT/author_coauth.gexf

# Open in GEPHI and update the layout, save as $OUT/author_coauth_layout.gexf
cp $OUT/author_coauth.gexf $OUT/author_coauth_layout.gexf

famri create-database $OUT/author_publications.json $OUT/author_coauth_layout.gexf $OUT/database.yml
famri export-project $OUT/database.yml $OUT/project.yml
famri export-db-as-csv $OUT/database.yml $OUT/database
famri export-db-as-gexf $OUT/database.yml $OUT/coauthor_network.gexf $OUT/topicauthor_network.gexf

famri create-database $OUT/all_publications.json $OUT/author_coauth_layout.gexf $OUT/all_database.yml
famri export-project $OUT/all_database.yml $OUT/all_project.yml
famri export-db-as-csv $OUT/all_database.yml $OUT/all_database

slice() {
  famri limit-pubs-by-year $OUT/author_publications.json $1 $2 $OUT/author_publications_$1-$2.json
  famri create-database $OUT/author_publications_$1-$2.json $OUT/author_coauth_layout.gexf $OUT/database_$1-$2.yml
  famri export-project $OUT/database_$1-$2.yml $OUT/project_$1-$2.yml
}

slice 2002 2007
slice 2002 2012
