import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    GeomapLegendComponent,
    ScienceMapLegendComponent,
    CoauthorNetworkLegendComponent
  ],
  declarations: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent,
    GeomapLegendComponent,
    ScienceMapLegendComponent,
    CoauthorNetworkLegendComponent
  ],
  providers: [GeomapDatabaseService]
})
export class VisualizationModule { }
