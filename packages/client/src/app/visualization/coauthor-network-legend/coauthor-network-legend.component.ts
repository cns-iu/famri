import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output
} from '@angular/core';
import { BoundField } from '@ngx-dino/core';

import { Filter, Author } from 'famri-database';

import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';
import { nodeSizeField } from '../shared/coauthor-network/coauthor-network-fields';

@Component({
  selector: 'famri-coauthor-network-legend',
  templateUrl: './coauthor-network-legend.component.html',
  styleUrls: ['./coauthor-network-legend.component.sass'],
  providers: [CoauthorNetworkDatabaseService]
})
export class CoauthorNetworkLegendComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Output() filterUpdateComplete = new EventEmitter<boolean>();

  filteredAuthors: Author[];
  nodeSize: BoundField<string>;

  gradient = '';
  colorLegendTitle: string;
  minColorValueLabel: string;
  midColorValueLabel: string;
  maxColorValueLabel: string;

  constructor(private dataService: CoauthorNetworkDatabaseService) { }

  ngOnInit() {
    this.colorLegendTitle = this.dataService.colorLegendEncoding;
    this.minColorValueLabel = this.dataService.minColorValueLabel;
    this.midColorValueLabel = this.dataService.midColorValueLabel;
    this.maxColorValueLabel = this.dataService.maxColorValueLabel;
    this.gradient = `linear-gradient(to top, ${this.dataService.nodeColorRange.join(', ')})`;

    this.dataService.filteredAuthors.subscribe((authors) => {
      this.filteredAuthors = authors;
    });

    // not user facing
    this.nodeSize = nodeSizeField.getBoundField('size');
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
