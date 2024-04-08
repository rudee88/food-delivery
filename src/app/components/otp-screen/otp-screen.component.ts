import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.scss'],
})
export class OtpScreenComponent  implements OnInit {
  @Input() sendOtp = false;
  otp: string;
  length: number;
  @Output() verified: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private globalService: GlobalService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    if (this.sendOtp) this.onResend();
  }

  onGetOtpLength(length) {
    this.length = length
  }

  onOtpChange(otp) {
    this.otp = otp
    console.log('otp: ', otp);
  }

  onResend() {
    console.log('send otp again');
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
    if (this.otp.length !== this.length) return this.globalService.showAlert('Please enter proper OTP');
    this.globalService.showLoader();
    this.profileService.verifyEmailOtp({ verification_token: this.otp })
    .then(response => {
      console.log('response: ', response);
      if (!response) {
        this.globalService.showAlert('Wrong OTP or Email Verification Token Is Expired. Please try again...');
        this.verified.emit(false);
      } else {
        this.verified.emit(true);
        this.globalService.successToast('Your Email is Verified Successfully');
      }
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
