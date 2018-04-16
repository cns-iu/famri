import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoGeomapModule } from '@ngx-dino/geomap';
import { DinoScienceMapLegendModule } from '@ngx-dino/science-map-legend';

import { CoauthorNetworkComponent } from './coauthor-network/coauthor-network.component';
import { ScienceMapComponent } from './science-map/science-map.component';

import { GeomapDatabaseService } from './shared/geomap/geomap-database.service';
import { GeomapComponent } from './geomap/geomap.component';
import { GeomapLegendComponent } from './geomap-legend/geomap-legend.component';
import { ScienceMapLegendComponent } from './science-map-legend/science-map-legend.component';

@NgModule({
  imports: [
    CommonModule,

    DinoForceNetworkModule,
    DinoScienceMapModule,
    DinoGeomapModule,
    DinoScienceMapLegendModule
  ],
  exports: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent,
    GeomapLegendComponent,
    ScienceMapLegendComponent
  ],
  declarations: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent,
    GeomapLegendComponent,
    ScienceMapLegendComponent
  ],
  providers: [GeomapDatabaseService]
})
export class VisualizationModule { }
