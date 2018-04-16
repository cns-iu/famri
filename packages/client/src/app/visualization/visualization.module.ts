import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoGeomapModule } from '@ngx-dino/geomap';

import { CoauthorNetworkComponent } from './coauthor-network/coauthor-network.component';
import { ScienceMapComponent } from './science-map/science-map.component';
import { DinoScienceMapLegendModule } from '@ngx-dino/science-map-legend';

import { GeomapDatabaseService } from './shared/geomap/geomap-database.service';
import { GeomapComponent } from './geomap/geomap.component';
import { GeomapLegendComponent } from './geomap-legend/geomap-legend.component';

@NgModule({
  imports: [
    CommonModule,

    DinoForceNetworkModule,
    DinoScienceMapModule,
    DinoScienceMapLegendModule,

    DinoGeomapModule
  ],
  exports: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent,
    GeomapLegendComponent
  ],
  declarations: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent,
    GeomapLegendComponent
  ],
  providers: [
    GeomapDatabaseService
  ]
})
export class VisualizationModule { }
