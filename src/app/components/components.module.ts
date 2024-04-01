import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
   SearchLocationComponent,
   OtpInputComponent
  ],
  imports: [
    IonicModule, 
    CommonModule,
    NgOtpInputModule,
  ],
  exports: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
    SearchLocationComponent,
    OtpInputComponent
  ],
})
export class ComponentsModule {}
