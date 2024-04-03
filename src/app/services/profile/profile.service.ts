import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private apiService: ApiService
  ) { }

  updateProfile(profile, param) {
    try {
      const data = new User (
        param.email,
        param.phone,
        profile.name
      );
      this._profile.next(data);
    } catch(e) {
      console.log(e);
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
