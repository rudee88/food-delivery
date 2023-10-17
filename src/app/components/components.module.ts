import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { SearchLocationComponent } from './search-location/search-location.component';

@NgModule({
  declarations: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
  SearchLocationComponent
  ],
  imports: [IonicModule, CommonModule],
  exports: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
    SearchLocationComponent,
  ],
})
export class ComponentsModule {}
