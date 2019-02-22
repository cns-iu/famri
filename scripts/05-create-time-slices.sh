#!/bin/bash
source constants.sh
set -ev

slice() {
  famri limit-pubs-by-year $OUT/author_publications.json $1 $2 $OUT/author_publications_$1-$2.json
  famri create-database $OUT/author_publications_$1-$2.json $OUT/author_coauth_layout.gexf $OUT/database_$1-$2.yml
  famri export-project $OUT/database_$1-$2.yml $OUT/project_$1-$2.yml
}

slice 2002 2005
slice 2002 2009
