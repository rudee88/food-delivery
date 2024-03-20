import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor() { }

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
}
