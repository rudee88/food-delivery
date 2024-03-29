import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // type = 'password';
  // iconName = 'eye-outline';
  type = true;
  isLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.isLoggedIn();
  }

  async isLoggedIn() {
    try {
      this.globalService.showLoader();
      const val = await this.authService.getToken();
      console.log('uid value:', val);
      if (val) this.navigate();
      this.globalService.hideLoader();
    } catch (e) {
      console.log(e);
      this.globalService.hideLoader();
    }
  }

  changeType() {
    // if (this.iconName === 'eye-outline') {
    //   this.type = 'text';
    //   this.iconName = 'eye-off-outline'
    // } else {
    //   this.type = 'password';
    //   this.iconName = 'eye-outline'
    // }
    this.type = !this.type;
  }

  login(form) {
    this.isLogin = true;
    this.authService
      .login(form.value.email, form.value.password)
      .then((data) => {
        console.log(data);
        this.navigate();
        this.isLogin = false;
        form.reset();
      })
      .catch((e) => {
        console.log(e);
        this.isLogin = false;
        let msg = 'Could not sign in, please try again';
        if (e?.error?.message) {
          msg = e.error.message;
        }
        this.globalService.showAlert(msg);
      });
  }

  navigate() {
    this.router.navigateByUrl('/tabs');
  }

  onReset(event) {
    console.log(event);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) return;
    this.login(form);
  }
}
