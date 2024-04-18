import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Banner } from 'src/app/interfaces/banner.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private apiService: ApiService
  ) { }

  async addBanner(formData) {
    try {
      const data = await this.apiService.post('banner/create', formData, true);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getBanners() {
    try {
      const data: Banner[] = await this.apiService.get('banner/banners');
      return data;
    } catch(e) {
      throw(e);
    }
  }

}
