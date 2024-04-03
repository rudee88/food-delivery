import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('forgot_pwd_modal') modal: ModalController;
  type = true;
  isLogin = false;
  reset_pwd_model = {
    email: '',
    otp: '',
    new_password: '',
  };

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
    this.reset_pwd_model = {
      email: '',
      otp: '',
      new_password: '',
    };
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) return;
    this.login(form);
  }

  onSendResetPasswordEmailOtp(email) {
    this.globalService.showLoader();
    this.authService
    .sendResetPasswordOtp(email)
    .then((data) => {
      console.log(data);
      this.reset_pwd_model = { ...this.reset_pwd_model, email };
      this.globalService.hideLoader();
    })
    .catch((e) => {
      console.log(e);
      this.globalService.hideLoader();
      let msg = 'Something went wrong, please try again';
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }

  onVerifyResetPasswordOtp(otp) {
    this.globalService.showLoader();
    this.authService
    .verifyResetPasswordOtp(this.reset_pwd_model.email, otp)
    .then((data) => {
      console.log(data);
      this.reset_pwd_model = { ...this.reset_pwd_model, otp };
      this.globalService.hideLoader();
    })
    .catch((e) => {
      console.log(e);
      this.globalService.hideLoader();
      let msg = 'Something went wrong, please try again';
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }

  onResetPassword(new_password) {
    this.globalService.showLoader();
    this.reset_pwd_model = { ...this.reset_pwd_model, new_password }
    this.authService
    .resetPassword(this.reset_pwd_model)
    .then((data) => {
      console.log(data);
      this.globalService.hideLoader();
      this.modal.dismiss();
      this.globalService.successToast('Your password is changed successfully. Please login now.');
    })
    .catch((e) => {
      console.log(e);
      this.globalService.hideLoader();
      let msg = 'Something went wrong, please try again';
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }
}
