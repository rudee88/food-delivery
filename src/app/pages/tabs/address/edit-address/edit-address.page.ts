import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { SearchPlace } from 'src/app/models/search-place.model';

import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  location = {} as SearchPlace;
  isLocationFetched: boolean;
  center: any;
  update: boolean;
  id: any;
  isLoading: boolean = false;
  from: string;
  check: boolean = false;

  constructor(
    private addressService: AddressService,
    private globalService: GlobalService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private googleMapsService: GoogleMapsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkForUpdate();
  }

  checkForUpdate() {
    this.isLoading = true;
    this.location.title = 'Locating...';
    this.isLocationFetched = false;
    this.route.queryParamMap.subscribe(async (paramMap) => {
      console.log('data: ', paramMap);
      const dataParam = paramMap.get('data');
      if (dataParam) {
        const data = JSON.parse(dataParam);
        if (data) {
          const address = data;
          if (address?.lat) {
            this.center = {
              lat: address.lat,
              lng: address.lng,
            };
            this.update = true;
            this.location.lat = this.center.lat;
            this.location.lng = this.center.lng;
            this.location.address = address.address;
            this.location.title = address.title;
            if (!address?.from) this.id = address.id;
          }
          if (address?.from) this.from = address.from;
          await this.initForm(address);
          this.toggleFetched();
        }
      } else {
        this.update = false;
        this.initForm();
      }
    });
  }

  initForm(address?) {
    let data = {
      title: null,
      house: null,
      landmark: null,
    };
    if (address) {
      data = {
        title: address.title,
        house: address.house,
        landmark: address.landmark,
      };
    }
    this.formData(data);
  }

  formData(data?) {
    this.form = new FormGroup({
      title: new FormControl(data.title, { validators: [Validators.required] }),
      house: new FormControl(data.house, { validators: [Validators.required] }),
      landmark: new FormControl(data.landmark, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }

  onFetchLocation(event) {
    this.location = event;
    console.log('location: ', this.location);
    this.isLocationFetched = true;
  }

  toggleFetched() {
    this.isLocationFetched = !this.isLocationFetched;
  }

  toggleSubmit() {
    this.isSubmitted = !this.isSubmitted;
  }

  async onSearchLocation() {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: 'address-modal',
        swipeToClose: true,
      };
      const location = await this.globalService.createModal(options);
      console.log('location: ', location);
      if (location) {
        this.location = location;
        const loc = {
          lat: location.lat,
          lng: location.lng
        }
        // update marker
        this.update = true;
        this.googleMapsService.changeMarkerInMap(loc);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async onSubmit() {
    try {
      this.toggleSubmit();
      console.log(this.form);
      if (!this.form || !this.isLocationFetched) {
        this.toggleSubmit();
        return;
      }
      const data = {
        title: this.form.value.title,
        landmark: this.form.value.landmark,
        house: this.form.value.house,
        address: this.location.address,
        lat: this.location.lat,
        lng: this.location.lng,
      };
      console.log('address: ', data);
      if (!this.id) await this.addressService.addAddress(data);
      else await this.addressService.updateAddress(this.id, data);
      this.check = true;
      this.navCtrl.back();
      this.toggleSubmit();
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave EditAdressPage');
    if (this.from === 'home' && !this.check) {
      this.addressService.changeAddress({});
    }
  }

}
