import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';
import { Author, CoAuthorEdge, CoAuthorGraph, Filter } from 'famri-database';

import { nodeSizeField, nodeIDField, nodeColorField, nodeLabelField } from '../shared/coauthor-network/coauthor-network-fields';

import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';

@Component({
  selector: 'famri-coauthor-network',
  templateUrl: './coauthor-network.component.html',
  styleUrls: ['./coauthor-network.component.sass']
})
export class CoauthorNetworkComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Input() numCoAuthors = 50;
  @Input() width: number;
  @Input() height: number;
  @Output() filterUpdateComplete = new EventEmitter<boolean>();

  graph: Observable<CoAuthorGraph>;

  nodeSize: BoundField<string>;
  nodeID: BoundField<string>;
  nodeColor: BoundField<string>;
  nodeLabel: BoundField<string>;

  nodeColorRange: string[];

  constructor(private dataService: CoauthorNetworkDatabaseService) { }

  ngOnInit() {
    this.graph = this.dataService.filteredGraph;

    // not user facing
    this.nodeSize = nodeSizeField.getBoundField('size');
    this.nodeID = nodeIDField.getBoundField('id');
    this.nodeColor = nodeColorField.getBoundField('color');
    this.nodeLabel = nodeLabelField.getBoundField('label');

    this.nodeColorRange = this.dataService.nodeColorRange;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes) && this.filter) {
      const filter: Partial<Filter> = Object.assign({}, this.filter, {limit: this.numCoAuthors});
      this.dataService.fetchData(filter).subscribe(undefined, undefined, () => {
        this.filterUpdateComplete.emit(true);
      });
    }
  }
}
