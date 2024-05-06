import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(
    private apiService: ApiService
  ) { }

  async addCity(formData) {
    try {
      const data = await this.apiService.post('city/create', formData, true);
      return data;
    } catch(e) {
      throw(e);
    }
  }

  async getCities() {
    try {
      const data = await this.apiService.get('city/cities');
      return data;
    } catch(e) {
      throw(e);
    }
  }

}
