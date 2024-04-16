import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Injectable({
  providedIn: 'root',
})
export class OtpGuard implements CanActivate {
  constructor(private router: Router, private profileService: ProfileService) {}

  canActivate() {
    return this.profileService.profile.pipe(
      take(1),
      map((user) => {
        console.log('otp guard user: ', user);
        if (user?.email_verified) {
          return this.router.parseUrl('/tabs');
        }
        return true;
      })
    );
  }
}
