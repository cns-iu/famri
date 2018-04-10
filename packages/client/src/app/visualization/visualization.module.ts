import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DinoForceNetworkModule } from '@ngx-dino/force-network';
import { DinoScienceMapModule } from '@ngx-dino/science-map';
import { DinoGeomapModule } from '@ngx-dino/geomap';

import { CoauthorNetworkComponent } from './coauthor-network/coauthor-network.component';
import { ScienceMapComponent } from './science-map/science-map.component';
import { GeomapComponent } from './geomap/geomap.component';

@NgModule({
  imports: [
    CommonModule,

    DinoForceNetworkModule,
    DinoScienceMapModule,
    DinoGeomapModule
  ],
  exports: [
    CoauthorNetworkComponent,
    ScienceMapComponent,
    GeomapComponent
  ],
  declarations: [CoauthorNetworkComponent, ScienceMapComponent, GeomapComponent]
})
export class VisualizationModule { }
