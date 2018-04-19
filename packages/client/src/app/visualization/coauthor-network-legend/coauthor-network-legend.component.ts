import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as d3Selection from 'd3-selection';
import * as d3Array from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { BoundField } from '@ngx-dino/core';

import { Filter, Author, CoAuthorEdge } from 'famri-database';

import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';
import { nodeSizeField, edgeSizeField } from '../shared/coauthor-network/coauthor-network-fields';

@Component({
  selector: 'famri-coauthor-network-legend',
  templateUrl: './coauthor-network-legend.component.html',
  styleUrls: ['./coauthor-network-legend.component.sass']
})
export class CoauthorNetworkLegendComponent implements OnInit, OnChanges {
  @Input() filter: Partial<Filter> = {};
  @Input() numCoAuthors = 50;
  @Input() edgeSizeRange: number[];
  @Output() filterUpdateComplete = new EventEmitter<boolean>();

  filteredAuthors: Observable<Author[]>;
  filteredCoauthors: Observable<CoAuthorEdge[]>;

  nodeSize: BoundField<string>;
  edgeSize: BoundField<number>;

  gradient = '';
  colorLegendTitle: string;
  edgeLegendTitle: string;
  minColorValueLabel: string;
  midColorValueLabel: string;
  maxColorValueLabel: string;
  maxEdgeLegendLabel: string;
  midEdgeLegendLabel: string;
  minEdgeLegendLabel: string;
  maxEdge: number;
  midEdge: number;
  minEdge: number;

  edgeSizeScale: any;

  constructor(private dataService: CoauthorNetworkDatabaseService) {
    this.filteredAuthors = this.dataService.filteredAuthors.asObservable();
    this.filteredCoauthors = this.dataService.filteredCoauthors.asObservable();
  }

  ngOnInit() {
    this.colorLegendTitle = this.dataService.colorLegendEncoding;
    this.edgeLegendTitle = this.dataService.edgeLegendEncoding;
    this.minColorValueLabel = this.dataService.minColorValueLabel;
    this.midColorValueLabel = this.dataService.midColorValueLabel;
    this.maxColorValueLabel = this.dataService.maxColorValueLabel;
    this.gradient = `linear-gradient(to top, ${this.dataService.nodeColorRange.join(', ')})`;

    // not user facing
    this.nodeSize = nodeSizeField.getBoundField('size');
    this.edgeSize = edgeSizeField.getBoundField('edgeSize');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('filter' in changes) && this.filter) {
      const filter: Partial<Filter> = Object.assign({}, this.filter, {limit: this.numCoAuthors});
      this.dataService.fetchData(filter).subscribe(undefined, undefined, () => {
        this.filterUpdateComplete.emit(true);
      });
      this.filteredCoauthors.subscribe((coauthorEdges) => {
        this.updateEdgeLegendLabels(coauthorEdges);
        this.updateEdgeLegendSizes(coauthorEdges);
      });
    }
  }

  updateEdgeLegendLabels(coauthorEdges: CoAuthorEdge[]) {
    this.maxEdge = Math.round(d3Array.max(coauthorEdges, (d: any) => this.edgeSize.get(d)));
    this.minEdge = Math.round(d3Array.min(coauthorEdges, (d: any) => this.edgeSize.get(d)));
    this.midEdge = Math.round((this.maxEdge + this.minEdge) / 2);
    this.maxEdgeLegendLabel = (!isNaN(this.maxEdge)) ? this.maxEdge.toString() : '';
    this.midEdgeLegendLabel = (!isNaN(this.midEdge)) ? this.midEdge.toString() : '';
    this.minEdgeLegendLabel = (!isNaN(this.minEdge)) ? this.minEdge.toString() : '';
  }

  updateEdgeLegendSizes(coauthorEdges: CoAuthorEdge[]) {
    this.edgeSizeScale = scaleLinear()
    .domain([0, d3Array.max(coauthorEdges, (d: any) => this.edgeSize.get(d))])
    .range(this.dataService.edgeSizeRange);

    d3Selection.select('#maxEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.maxEdge));
    d3Selection.select('#midEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.midEdge));
    d3Selection.select('#minEdge').select('line').attr('stroke-width', this.edgeSizeScale(this.minEdge));
  }

}
