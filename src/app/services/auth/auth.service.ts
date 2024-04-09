import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, from, of } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string>(null);

  get token() {
    return this._token.asObservable();
  }

  updateToken(value) {
    this._token.next(value);
  }

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private profileService: ProfileService,
    private globalService: GlobalService
  ) { }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email,
        password
      };
      const response = await this.api.get('user/login', data);
      this.setUserData(response?.token);
      this.updateProfileData(response?.user);
      console.log(response);
      return response;
    } catch(e) {
      console.error(e);
      throw(e)
    }
  }

  async getToken() {
    let token = this._token.value;
    if (!token) {
      token = (await this.storage.getStorage('rsp_foodDelivery_token')).value;
      this.updateToken(token);
    }
    return token;
  }

  async getUser() {
    const token = await this.getToken();
    console.log('token', token);
    try {
      if (token) {
        const user = this.profileService.getProfile();
        console.log('user: ', user);
        if (user) return user;
        return false;
      }
      return null;
    } catch(e) {
      if (token) return false;
      return null;
    }
  }

  isLoggedIn() {
    return from(this.getToken());
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
      this.setUserData(response?.token);
      this.updateProfileData(response?.user);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  async sendResetPasswordOtp(email) {
    try {
      const data = { email };
      const response = await this.api.get('user/send/reset/password/token', data);
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  async verifyResetPasswordOtp(email: string, otp: string) {
    try {
      const data = { 
        email,
        reset_password_token: otp
      };
      const response = await this.api.get('user/verify/resetPasswordToken', data);
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  setUserData(token: string) {
    this.storage.setStorage('rsp_foodDelivery_token', token);
    this.updateToken(token);
  }

  updateProfileData(data) {
    this.profileService.updateProfileData(data);
  }

  async resetPassword(data) {
    try {
      const response = await this.api.patch('user/reset/password', data);
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
    }
  }

  logOut() {
    this.storage.removeStorage('rsp_foodDelivery_token');
    this._token.next(null);
    this.profileService.updateProfileData(null);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
