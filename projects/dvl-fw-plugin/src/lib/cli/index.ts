import * as program from 'commander';

import {
  exportProject, extractAuthorsFromGrants, limitPubs, limitPubsByYear,
  extractCoAuthGexf, createDatabase, exportDbAsCSV, extractDbAsGexf
} from './actions';

program
  .description('FAMRI Data Tools');

program
  .command('extract-authors <grantsXLSX> <authorsCsv>')
  .description('Extract authors from the provided grants.xlsx')
  .action(extractAuthorsFromGrants);

program
  .command('limit-pubs <inPubsJson> <authorsCsv> <outPubsJson>')
  .description('Limit publications to just authors provided.')
  .action(limitPubs);

program
  .command('limit-pubs-by-year <inPubsJson> <startYear> <endYear> <outPubsJson>')
  .description('Limit publications to year range.')
  .action(limitPubsByYear);

program
  .command('extract-coauth-gexf <inPubsJson> <outCoAuthGexf>')
  .description('Extract a co-authorship network from publications and create a GEXF file for loading into GEPHI')
  .action(extractCoAuthGexf);

program
  .command('create-database <inPubsJson> <inCoAuthGexf> <outDbYamlFile>')
  .description('Combine data to create a database.yml')
  .action(createDatabase);

program
  .command('export-db-as-csv <inDbYamlFile> <outCsvBase>')
  .description('Export the database yml as a set of flat csv files')
  .action(exportDbAsCSV);

program
  .command('export-db-as-gexf <inDbYamlFile> <outCoAuthGexf> <outTopicAuthGexf>')
  .description('Export the database yml\'s coauthor network as a gexf file')
  .action(extractDbAsGexf);

program
  .command('export-project <inDbYaml> <outYAML>')
  .description('Export Data to a DVL-FW project.yml file')
  .action(exportProject);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
