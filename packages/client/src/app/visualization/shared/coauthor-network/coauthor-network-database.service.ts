import { Injectable } from '@angular/core';

@Injectable()
export class CoauthorNetworkDatabaseService {
  // defaults
  nodeColorRange = ['#FFFFFF', '#3683BB', '#3182BD'];
  colorLegendEncoding = 'Year of First Publication (TBD)';
  minColorValueLabel = '2007';
  midColorValueLabel = '2012';
  maxColorValueLabel = '2017';

  constructor() { }

}
