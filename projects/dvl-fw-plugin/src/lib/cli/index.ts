import * as program from 'commander';

import { exportProject, extractAuthorsFromGrants, limitPubs, extractCoAuthGexf, createDatabase } from './actions';

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
  .command('extract-coauth-gexf <inPubsJson> <outCoAuthGexf>')
  .description('Extract a co-authorship network from publications and create a GEXF file for loading into GEPHI')
  .action(extractCoAuthGexf);

program
  .command('create-database <inPubsJson> <inCoAuthGexf> <outDbYamlFile>')
  .description('Combine data to create a database.yml')
  .action(createDatabase);

program
  .command('export-project <inDbYaml> <outYAML>')
  .description('Export Data to a DVL-FW project.yml file')
  .action(exportProject);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
