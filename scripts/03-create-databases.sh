#!/bin/bash
source constants.sh
set -ev

famri create-database $OUT/author_publications.json $OUT/author_coauth_layout.gexf $OUT/database.yml
famri create-database $OUT/all_publications.json $OUT/author_coauth_layout.gexf $OUT/all_database.yml
