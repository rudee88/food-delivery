import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  async login(email: string, password: string): Promise<any> {
    // call login api
    return await this.storage.setStorage('uid', 'SDADSAJKDSJ');
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

      const response = this.http.post<User>(environment.serverBaseUrl + 'user/signup', data).toPromise();
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  async resetPassword(email: string) {
    return await email;
  }

  logOut() {

  }
}
