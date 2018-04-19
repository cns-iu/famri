import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Author, CoAuthorEdge, CoAuthorGraph, Filter, DatabaseService } from 'famri-database';

@Injectable()
export class CoauthorNetworkDatabaseService {
  private dataSubscription: Subscription;
  filteredGraph = new BehaviorSubject<CoAuthorGraph>({authors: [], coauthorEdges: []});
  filteredAuthors = new BehaviorSubject<Author[]>([]);

  // defaults
  nodeColorRange = ['#FFFFFF', '#3683BB', '#3182BD'];
  colorLegendEncoding = 'Year of First Publication (TBD)';
  minColorValueLabel = '2007';
  midColorValueLabel = '2012';
  maxColorValueLabel = '2017';

  constructor(private databaseService: DatabaseService) { }

  fetchData(filter: Partial<Filter> = {}): Observable<CoAuthorGraph> {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const graph = this.databaseService.getCoAuthorGraph(filter);
    this.dataSubscription = graph.subscribe((graph) => {
        this.filteredGraph.next(graph);
        this.filteredAuthors.next(graph.authors);
      }
    );
    return graph;
  }
}
