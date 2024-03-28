import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
      const token = await this.authService.isLoggedIn().toPromise();
      console.log(token);
      if (token) return true;
      else {
        this.router.navigateByUrl('/login', { replaceUrl: true });
        return false;
      }
    } 
}
