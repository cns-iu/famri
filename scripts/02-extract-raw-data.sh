#!/bin/bash
source constants.sh
set -ev

reflib "$EN_LIBRARY" -o json -f $OUT/all_publications.json
famri extract-authors "$AUTHOR_MAPPING" $OUT/authors.csv

famri limit-pubs $OUT/all_publications.json $OUT/authors.csv $OUT/author_publications.json
famri extract-coauth-gexf $OUT/author_publications.json $OUT/author_coauth.gexf

# Open in GEPHI and update the layout, save as $OUT/author_coauth_layout.gexf
cp $OUT/author_coauth.gexf $OUT/author_coauth_layout.gexf
