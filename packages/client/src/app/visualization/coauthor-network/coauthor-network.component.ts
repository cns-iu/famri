import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { BoundField } from '@ngx-dino/core';
import { Author, Filter } from 'famri-database';

import {
  nodeSizeField,
  nodeIDField,
  nodeColorField,
  nodeLabelField
} from '../shared/coauthor-network/coauthor-network-fields';

import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';

@Component({
  selector: 'famri-coauthor-network',
  templateUrl: './coauthor-network.component.html',
  styleUrls: ['./coauthor-network.component.sass'],
  providers: [CoauthorNetworkDatabaseService]
})
export class CoauthorNetworkComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Input() width: number;
  @Input() height: number;
  @Output() filterUpdateComplete = new EventEmitter<boolean>();

  filteredAuthors: Author[];
  filteredCoAuthors: any[];

  nodeSize: BoundField<string>;
  nodeID: BoundField<string>;
  nodeColor: BoundField<string>;
  nodeLabel: BoundField<string>;

  nodeColorRange: string[];

  constructor(private dataService: CoauthorNetworkDatabaseService) { }

  ngOnInit() {
    this.dataService.filteredAuthors.subscribe((authors) => {
      this.filteredAuthors = authors;
    });

    this.dataService.filteredCoAuthors.subscribe((coAuthors) => {
      this.filteredCoAuthors = coAuthors;
    });

    // not user facing
    this.nodeSize = nodeSizeField.getBoundField('size');
    this.nodeID = nodeIDField.getBoundField('id');
    this.nodeColor = nodeColorField.getBoundField('color');
    this.nodeLabel = nodeLabelField.getBoundField('label');

    this.nodeColorRange = this.dataService.nodeColorRange;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes) && this.filter) {
      this.dataService.fetchAuthorData(this.filter).subscribe(
        undefined, undefined, () => this.filterUpdateComplete.emit(true)
      );

      this.dataService.fetchCoAuthorData(this.filter).subscribe(
        undefined, undefined, () => this.filterUpdateComplete.emit(true)
      );
    }
  }
}
