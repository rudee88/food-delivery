import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddressPageRoutingModule } from './edit-address-routing.module';

import { EditAddressPage } from './edit-address.page';
import { MapComponent } from 'src/app/components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EditAddressPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditAddressPage, MapComponent]
})
export class EditAddressPageModule {}
