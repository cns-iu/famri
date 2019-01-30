import { UndirectedGraph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import gexf from 'graphology-gexf';

import { fs, readJSON } from '../utils';

export function extractCoAuthGexf(inputPubs: string, outputGexf: string) {
  const pubs: any[] = readJSON(inputPubs);
  const graph = new UndirectedGraph();

  const seenLinks = {};
  for (const pub of pubs) {
    const auths = pub.authors.sort();
    auths.forEach(a => graph.mergeNode(a, {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      size: 10
    }));

    auths.forEach((a1, index) => {
      for (const a2 of auths.slice(index + 1)) {
        const linkId = `${a1}---${a2}`;
        if (!seenLinks[linkId]) {
          graph.addEdgeWithKey(linkId, a1, a2, {
            weight: 10
          });
          seenLinks[linkId] = true;
        }
      }
    });
  }

  const settings = forceAtlas2.inferSettings(graph);
  const positions = forceAtlas2(graph, {iterations: 500, settings});
  for (const author of Object.keys(positions)) {
    graph.mergeNode(author, positions[author]);
  }

  const gexfString = gexf.write(graph);
  fs.writeFileSync(outputGexf, gexfString);
}
