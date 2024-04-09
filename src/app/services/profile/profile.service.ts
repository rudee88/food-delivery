import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { GlobalService } from '../global/global.service';
import { Router } from '@angular/router';

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
    private globalService: GlobalService,
    private router: Router
  ) { }

  async getProfile() {
    try {
      const profile_data = this._profile.value;
      if (!profile_data) {
        const profile = await this.apiService.get('user/profile');
        console.log('profile data:', profile);
      // const data = new User(
      //   profile?.email,
      //   profile?.phone,
      //   profile?.name,
      //   profile?._id,
      //   profile?.type,
      //   profile?.status,
      //   profile?.email_verified
      // )
      return this.updateProfileData(profile);
      } else return profile_data;
    } catch(e) {
      console.error(e);
      this.handleHTTPError(e); // Handle error
      throw(e);
    }
  }

  handleHTTPError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (!navigator.onLine) {
      errorMessage = 'No Internet Connection';
    } else if (error.status === 0 || error.name === 'HttpErrorResponse') {
      errorMessage = 'Cannot connect to the server. Please check your connection.';
    }
    console.error(errorMessage);
    this.globalService.showAlert(errorMessage)
  }

  navigate(url) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  async updatePhoneNumber(phone) {
    try {
      const profile = await this.apiService.patch('user/update/phone', { phone });
      console.log('profile: ', profile);
      // const data = new User (
      //   profile.email,
      //   profile.phone,
      //   profile.name,
      //   profile._id,
      //   profile.type,
      //   profile.status,
      //   profile.email_verified
      // );
      this.updateProfileData(profile);
    } catch(e) {
      console.log(e);
    }
  }

  async updateProfile(param) {
    try {
      const profile_data = await this.apiService.patch('user/update/profile', {...param});
      const profile = profile_data?.user;
      console.log('param: ', profile);
      this.updateProfileData(profile);
      return profile_data;
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
      let profile_data: User = this._profile.value;
      if (profile_data) {
        profile_data = { ...profile_data, email_verified: true }
        this.updateProfileData(profile_data);
      };
      return response;
    } catch(e) {

    }
  }

  updateProfileData(profile) {
    let data: any;
    if (profile) {
      data = new User (
        profile?.email,
        profile?.phone,
        profile?.name,
        profile?._id,
        profile?.type,
        profile?.status,
        profile?.email_verified
        );
    } else data = profile;
    console.log('profile data: ', data);
    this._profile.next(data);
    return data;
  }

}
