import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NouisliderModule } from 'ng2-nouislider';

import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoScienceMapLegendModule } from '@ngx-dino/science-map-legend';
import { DinoGeomapModule } from '@ngx-dino/geomap';

import { CoauthorNetworkComponent } from './coauthor-network/coauthor-network.component';
import { ScienceMapComponent } from './science-map/science-map.component';

import { GeomapDatabaseService } from './shared/geomap/geomap-database.service';
import { GeomapComponent } from './geomap/geomap.component';
import { GeomapLegendComponent } from './geomap-legend/geomap-legend.component';
import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';
import { CoauthorNetworkLegendComponent } from './coauthor-network-legend/coauthor-network-legend.component';
import { FilterComponent } from './filter/filter.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  imports: [
    CommonModule,

    NouisliderModule,

    DinoForceNetworkModule,
    DinoScienceMapModule,
    DinoScienceMapLegendModule,
    DinoGeomapModule
  ],
  exports: [
    CoauthorNetworkComponent,
    CoauthorNetworkLegendComponent,

    ScienceMapComponent,
    ScienceMapLegendComponent,

    GeomapComponent,
    GeomapLegendComponent,

    StatisticsComponent,

    FilterComponent
  ],
  declarations: [
    CoauthorNetworkComponent,
    CoauthorNetworkLegendComponent,

    ScienceMapComponent,
    ScienceMapLegendComponent,

    GeomapComponent,
    GeomapLegendComponent,

    StatisticsComponent,

    FilterComponent
  ],
  providers: [GeomapDatabaseService]
})
export class VisualizationModule { }
