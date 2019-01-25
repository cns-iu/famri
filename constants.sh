shopt -s expand_aliases

EN_LIBRARY="./raw-data/orig/2019-01-25/My EndNote Library_FAMRI_REFERENCE_GROUP_1-23-19.xml"
AUTHOR_MAPPING="./raw-data/orig/2019-01-09/FAMRI_grants_2002-2017_01-9-19.xlsx"
OUT="./raw-data/data/2019-01-26"
mkdir -p $DATA $OUT

alias famri="node --max_old_space_size=5000 ./dist/dvl-fw-plugin/famri"
alias reflib="./node_modules/.bin/reflib"
