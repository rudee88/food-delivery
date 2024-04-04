import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private globalService: GlobalService
  ) { }

  async getProfile() {
    try {
      const profile = await this.apiService.get('user/profile');
      const data = new User(
        profile?.email,
        profile?.phone,
        profile?.name,
        profile?._id,
        profile?.type,
        profile?.status,
        profile?.email_verified
      )
      this._profile.next(data);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updatePhoneNumber(phone) {
    try {
      const profile = await this.apiService.patch('user/update/phone', { phone });
      console.log('profile: ', profile);
      const data = new User (
        profile.email,
        profile.phone,
        profile.name,
        profile._id,
        profile.type,
        profile.status,
        profile.email_verified
      );
      this._profile.next(data);
    } catch(e) {
      console.log(e);
    }
  }

  async updateProfile(param) {
    try {
      const profile_data = await this.apiService.patch('user/update/profile', {...param});
      const profile = profile_data?.user;
      await this.authService.setUserData(profile_data?.token);
      console.log('param: ', profile);
      const data = new User (
        profile.email,
        profile.phone,
        profile.name,
        profile._id,
        profile.type,
        profile.status,
        profile.email_verified
      );
      this._profile.next(data);
    } catch(e) {
      console.log(e);
      let msg = null;
      if (e?.error?.message) msg = e.error.message;
      this.globalService.errorToast(msg);
    }
  }

  resendOtp() {
    return this.apiService.get('user/send/verification/email').then(response => {
      return response;
    })
    .catch(e => {
      throw(e);
    });
  }

  async verifyEmailOtp(data) {
    try {
      const response = await this.apiService.patch('user/verify/emailToken', data);
      return response;
    } catch(e) {

    }
  }

}
