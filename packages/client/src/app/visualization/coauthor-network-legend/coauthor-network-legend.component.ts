import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Filter } from 'famri-database';
import { CoauthorNetworkDatabaseService } from '../shared/coauthor-network/coauthor-network-database.service';

@Component({
  selector: 'famri-coauthor-network-legend',
  templateUrl: './coauthor-network-legend.component.html',
  styleUrls: ['./coauthor-network-legend.component.sass'],
  providers: [CoauthorNetworkDatabaseService]
})
export class CoauthorNetworkLegendComponent implements OnInit {
  @Input() filter: Partial<Filter> = {};
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
  }

}
