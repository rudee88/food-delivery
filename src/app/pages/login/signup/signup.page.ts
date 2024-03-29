import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.register(form);
  }

  register(form) {
    this.isLoading = true;
    console.log('form: ', form.value);
    this.authService.register(form.value).then(data => {
      // console.log('signup user data: ', data);
      this.router.navigateByUrl('/tabs/otp');
      this.isLoading = false;
      form.reset();
      this.globalService.successToast('An OTP is sent to your Email for Email Verification');
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg = 'Could not sign in you up, please try again';
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }

}
