import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
    private api: ApiService
  ) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email,
        password
      };

      const response = await this.api.get('user/login', data);
      this.setUserData(response.token);
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  async getId() {
    return (await this.storage.getStorage('uid')).value;
  }

  async register(formValue) {
    try {
      const data = {
        email: formValue.email,
        phone: formValue.phone,
        name: formValue.name,
        type: 'user',
        status: 'active',
        password: formValue.password
      };

      const response = await this.api.post('user/signup', data);
      console.log(response);
      this.setUserData(response.token);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  async resetPassword(email: string) {
    return await email;
  }

  setUserData(token: string, user?) {
    // const data = {
    //   email: user.email, test
    //   type: user.type
    // };
    this.storage.setStorage('rsp_foodDelivery_token', token);
    // this.storage.setStorage('rsp_foodDelivery_token', JSON.stringify(data));
  }

  logOut() {

  }
}
