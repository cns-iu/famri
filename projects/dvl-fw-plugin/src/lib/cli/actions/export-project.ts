const fs = require('fs');
import { ProjectSerializer } from '@dvl-fw/core';

import { readYAML } from '../utils';
import { FamriProject } from '../../shared/famri-project';
import { FamriDatabase } from './../../data-model/famri-database';

export async function exportProject(inData: string, outYAML: string) {
  const database = new FamriDatabase(readYAML(inData));
  const project = new FamriProject(database);
  const yamlString = await ProjectSerializer.toYAML(project);
  fs.writeFileSync(outYAML, yamlString, 'utf8');
}
