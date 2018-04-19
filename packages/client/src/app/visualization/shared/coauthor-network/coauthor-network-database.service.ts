import { Injectable } from '@angular/core';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Author, CoAuthorEdge, CoAuthorGraph, Filter, DatabaseService } from 'famri-database';

@Injectable()
export class CoauthorNetworkDatabaseService {
  private dataSubscription: Subscription;
  filteredGraph = new BehaviorSubject<CoAuthorGraph>({authors: [], coauthorEdges: []});
  filteredAuthors = new BehaviorSubject<Author[]>([]);
  filteredCoauthors = new BehaviorSubject<CoAuthorEdge[]>([]);

  // defaults
  nodeColorRange = ['#FDD3A1', '#E9583D', '#7F0000'];
  colorLegendEncoding = '# Co-Authors';
  edgeLegendEncoding = '# Co-Authored Publications';
  edgeSizeRange = [1, 8];

  constructor(private databaseService: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}): Observable<CoAuthorGraph> {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const graph = this.databaseService.getCoAuthorGraph(filter);
    this.dataSubscription = graph.subscribe((graph) => {
        this.filteredGraph.next(graph);
        this.filteredAuthors.next(graph.authors);
        this.filteredCoauthors.next(graph.coauthorEdges);
      }
    );
    return graph;
  }
}
