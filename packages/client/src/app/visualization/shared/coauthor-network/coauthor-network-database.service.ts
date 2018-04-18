import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Author, CoAuthorEdge, Filter, DatabaseService } from 'famri-database';

@Injectable()
export class CoauthorNetworkDatabaseService {
  private dataSubscription: Subscription;
  filteredAuthors = new BehaviorSubject<Author[]>([]);
  filteredCoAuthors = new BehaviorSubject<any[]>([]);

  // defaults
  nodeColorRange = ['#FFFFFF', '#3683BB', '#3182BD'];
  colorLegendEncoding = 'Year of First Publication (TBD)';
  minColorValueLabel = '2007';
  midColorValueLabel = '2012';
  maxColorValueLabel = '2017';

  constructor(private databaseService: DatabaseService) { }

  fetchAuthorData(filter: Partial<Filter> = {}): Observable<Author[]> {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const authors = this.databaseService.getAuthors(filter);
    this.dataSubscription = authors.subscribe(
      (auths) => this.filteredAuthors.next(auths)
    );
    return authors;
  }

  fetchCoAuthorData(filter: Partial<Filter> = {}): Observable<any[]> {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const coAuthors = this.databaseService.getCoAuthorEdges(filter);
    this.dataSubscription = coAuthors.subscribe(
      (coAuths) => this.filteredCoAuthors.next(coAuths)
    );
    return coAuthors;
  }

}
