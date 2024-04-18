import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private apiService: ApiService
  ) { }

  async addBanner(formData) {
    try {
      const data = await this.apiService.post('banner/create/banner', formData, true);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getBanners() {
    try {
      const data = await this.apiService.get('banner/banners');
      return data;
    } catch(e) {
      throw(e);
    }
  }

}
