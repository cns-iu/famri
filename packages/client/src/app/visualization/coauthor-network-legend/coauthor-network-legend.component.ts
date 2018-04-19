import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BoundField } from '@ngx-dino/core';

import { Filter, Author } from 'famri-database';

import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';
import { nodeSizeField } from '../shared/coauthor-network/coauthor-network-fields';

@Component({
  selector: 'famri-coauthor-network-legend',
  templateUrl: './coauthor-network-legend.component.html',
  styleUrls: ['./coauthor-network-legend.component.sass']
})
export class CoauthorNetworkLegendComponent implements OnInit {
  filteredAuthors: Observable<Author[]>;
  nodeSize: BoundField<string>;

  gradient = '';
  colorLegendTitle: string;
  minColorValueLabel: string;
  midColorValueLabel: string;
  maxColorValueLabel: string;

  constructor(private dataService: CoauthorNetworkDatabaseService) {
    this.filteredAuthors = this.dataService.filteredAuthors;
  }

  ngOnInit() {
    this.colorLegendTitle = this.dataService.colorLegendEncoding;
    this.minColorValueLabel = this.dataService.minColorValueLabel;
    this.midColorValueLabel = this.dataService.midColorValueLabel;
    this.maxColorValueLabel = this.dataService.maxColorValueLabel;
    this.gradient = `linear-gradient(to top, ${this.dataService.nodeColorRange.join(', ')})`;

    // not user facing
    this.nodeSize = nodeSizeField.getBoundField('size');
  }
}
