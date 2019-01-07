const fs = require('fs');

import { ProjectSerializer } from '@dvl-fw/core';
import { FamriProject } from '../shared/famri-project';

async function exportProject(outYAML) {
  const project = new FamriProject();
  const yamlString = await ProjectSerializer.toYAML(project);
  fs.writeFileSync(outYAML, yamlString, 'utf8');
}

const args = process.argv.slice(2);
exportProject(args[0]).then(() => {
  process.exit();
});
