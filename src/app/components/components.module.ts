import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoadingRestaurantComponent } from './loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { SearchLocationComponent } from './search-location/search-location.component';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';

@NgModule({
  declarations: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
   SearchLocationComponent,
   OtpInputComponent,
   OtpScreenComponent
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
    OtpInputComponent,
    OtpScreenComponent
  ],
})
export class ComponentsModule {}
