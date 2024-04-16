import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { GlobalService } from '../services/global/global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService,
    private globalService: GlobalService
  ) {}

  async canLoad(
    route: Route): Promise<boolean> {
    const existingRole = route.data?.['role'];
    console.log('existingRole: ', existingRole);
    const user = await this.authService.getUser();
    console.log('user: ', user);
    if (user) {
      if (user?.status != 'active') {
        this.authService.logOut();
        this.navigate('/login');
      }
      if (user?.type == existingRole) return true;
      else {
        this.redirect(user?.type)
        return false;
      };
    } else {
      this.navigate('/login');
      return false;
    }
  }

  navigate(url) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }


  redirect(role) {
    let url = '/tabs';
    if (role == 'admin') url = '/admin';
    this.navigate(url);
  }
}
