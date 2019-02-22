#!/bin/bash
source constants.sh
set -ev

famri export-project $OUT/database.yml $OUT/project.yml
famri export-db-as-csv $OUT/database.yml $OUT/database
famri export-db-as-gexf $OUT/database.yml $OUT/coauthor_network.gexf $OUT/topicauthor_network.gexf

famri export-project $OUT/all_database.yml $OUT/all_project.yml
famri export-db-as-csv $OUT/all_database.yml $OUT/all_database
