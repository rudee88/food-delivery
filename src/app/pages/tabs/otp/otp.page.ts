import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  otp: string;
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style'
  }

  constructor(
    private globalService: GlobalService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onOtpChange(otp) {
    this.otp = otp
    console.log('otp: ', otp);
  }

  onResend() {
    this.globalService.showLoader();
    this.profileService.resendOtp()
    .then(response => {
      console.log('resend verification response: ', response);
      this.globalService.hideLoader();
      if (response?.success) this.globalService.successToast('An OTP is sent to your Email for Email Verification');
    })
    .catch(e => {
      console.log(e);
      this.globalService.hideLoader();
      let msg = 'Something went wrong, Please try again!';
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }

  onVerify() {
    if (this.otp.length !== this.config.length) return this.globalService.showAlert('Please enter proper OTP');
    this.globalService.showLoader();
    this.profileService.verifyEmailOtp({ verification_token: this.otp })
    .then(response => {
      console.log('response: ', response);
      if (response) this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      else this.globalService.showAlert('Wrong OTP or Email Verification Token Is Expired. Please try again...')
      this.globalService.hideLoader();
    })
    .catch(e => {
      console.log(e);
      let msg = 'Something went wrong! Please try again...'
      this.globalService.hideLoader();
      if (e?.error?.message) {
        msg = e.error.message;
      }
      this.globalService.showAlert(msg);
    });
  }

}
