const fs = require('fs');
import { UndirectedGraph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import gexf from 'graphology-gexf';

import { readYAML } from '../utils';
import { FamriDatabase } from '../../data-model/famri-database';

export function extractDbAsGexf(inData: string, outputGexf: string) {
  const database = new FamriDatabase(readYAML(inData));
  const graph = new UndirectedGraph();

  for (const author of database.authors) {
    graph.addNode(author.name, Object.assign(author, 
      {defaultStyles: undefined, position: undefined, globalStats: undefined,
       x: Math.random() * 1000,y: Math.random() * 1000, size: 10}
    ));
  }
  for (const edge of database.coAuthorLinks) {
    graph.addEdgeWithKey(edge.identifier, edge.author1, edge.author2, Object.assign(edge,
      {defaultStyles: undefined, position: undefined, globalStats: undefined, 
        author1: undefined, author2: undefined, Author1: undefined, Author2: undefined,
        source: undefined, target: undefined}
    ));
  }

  const settings = forceAtlas2.inferSettings(graph);
  const positions = forceAtlas2(graph, {iterations: 500, settings});
  for (const author of Object.keys(positions)) {
    graph.mergeNode(author, positions[author]);
  }

  const gexfString = gexf.write(graph);
  fs.writeFileSync(outputGexf, gexfString);
}
