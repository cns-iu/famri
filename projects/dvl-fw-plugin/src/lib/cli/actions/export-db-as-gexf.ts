const fs = require('fs');
import { UndirectedGraph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import gexf from 'graphology-gexf';

import { readYAML } from '../utils';
import { FamriDatabase } from '../../data-model/famri-database';

function writeGraph(graph, outputGexf: string) {
  const gexfString = gexf.write(graph);
  fs.writeFileSync(outputGexf, gexfString);
}

export function extractDbAsGexf(inData: string, coAuthorGexf: string, topicAuthorGexf: string) {
  const database = new FamriDatabase(readYAML(inData));
  
  writeGraph(getCoAuthorGexf(database), coAuthorGexf);
  writeGraph(getTopicAuthorGexf(database), topicAuthorGexf);
}

function getCoAuthorGexf(database: FamriDatabase): UndirectedGraph {
  const graph = new UndirectedGraph();

  for (const author of database.authors) {
    graph.addNode(author.name, Object.assign(author,
      {
        // Remove boring fields
        defaultStyles: undefined, position: undefined, globalStats: undefined,
        // Give all nodes a label from author.name
        label: author.name,
        // Pipe delimit topic areas
        topicAreas: author.topicAreas.join('|'),
        // Setup vars for a default layout
        x: Math.random() * 1000, y: Math.random() * 1000, size: 10
      }
    ));
  }
  for (const edge of database.coAuthorLinks) {
    graph.addEdgeWithKey(edge.identifier, edge.author1, edge.author2, Object.assign(edge,
      {
        // Remove boring fields
        defaultStyles: undefined, position: undefined, globalStats: undefined,
        author1: undefined, author2: undefined, Author1: undefined, Author2: undefined,
        source: undefined, target: undefined
      }
    ));
  }

  const settings = forceAtlas2.inferSettings(graph);
  const positions = forceAtlas2(graph, {iterations: 500, settings});
  for (const author of Object.keys(positions)) {
    graph.mergeNode(author, positions[author]);
  }

  return graph;
}

function getTopicAuthorGexf(database: FamriDatabase): UndirectedGraph {
  const graph = new UndirectedGraph();

  for (const topic of database.topics) {
    graph.addNode(topic.name, Object.assign(topic,
      {
        // Remove boring fields
        defaultStyles: undefined, position: undefined, globalStats: undefined,
        // Give all nodes a label from author.name
        label: topic.name,
        // Add type info for bi-modal network
        type: 'topic',
        // Setup vars for a default layout
        x: Math.random() * 1000, y: Math.random() * 1000, size: 10
      }
    ));
  }
  for (const author of database.authors) {
    graph.addNode(author.name, Object.assign(author,
      {
        // Remove boring fields
        defaultStyles: undefined, position: undefined, globalStats: undefined, topicAreas: undefined,
        // Give all nodes a label from author.name
        label: author.name,
        // Add type info for bi-modal network
        type: 'author',
        // Setup vars for a default layout
        x: Math.random() * 1000, y: Math.random() * 1000, size: 10
      }
    ));
  }
  for (const edge of database.topicAuthorLinks) {
    graph.addEdgeWithKey(edge.identifier, edge.topic, edge.author, Object.assign(edge,
      {
        // Remove boring fields
        defaultStyles: undefined, position: undefined, globalStats: undefined,
        topic: undefined, author: undefined, Topic: undefined, Author: undefined,
        source: undefined, target: undefined
      }
    ));
  }

  const settings = forceAtlas2.inferSettings(graph);
  const positions = forceAtlas2(graph, {iterations: 500, settings});
  for (const author of Object.keys(positions)) {
    graph.mergeNode(author, positions[author]);
  }

  return graph;
}