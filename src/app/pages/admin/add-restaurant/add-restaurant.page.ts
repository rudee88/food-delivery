import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {
  isLoading = false;
  cities: any[] = [];
  location: any = {};
  coverImage: any;
  category: string;
  isCuisine: boolean = false;
  cuisines: any[] = [];
  categories: any[] = [];

  constructor(
    private authService: AuthService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.getCities();
  }

  getCities() {}

  async onSearchLocation() {
    try {
      const options = {
        component: SearchLocationComponent
      };
      const modal = await this.globalService.createModal(options);
      if (modal) {
        console.log('modal: ', modal);
        this.location = modal;
      }
    } catch(e) {
      console.log(e);
    }
  }

  onPreview(event) {
    console.log('event: ', event);
    const files = event.target.files;
    if (files.length == 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) return;
    const file = files[0];
    const filePath = 'restaurants/' + Date.now() + '_' + file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('result: ', reader.result);
      this.coverImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onAddCategory() {
    console.log('category: ', this.category);
    if (this.category.trim() == '') return;
    console.log('isCuisine: ',this.isCuisine);
    const checkString = this.categories.find(x => x == this.category);
    if (checkString) {
      this.globalService.errorToast('Category already added');
    }
    this.categories.push(this.category);
    if (this.isCuisine) this.cuisines.push(this.category);
  }

  onClearCategory() {
    this.categories = [];
    this.cuisines = [];
  }

  getArrayAsString(array) {
    return array.join(', ');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
  }

}
