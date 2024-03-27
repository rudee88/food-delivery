import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style'
  }

  constructor() { }

  ngOnInit() {
  }

  onResend() {

  }

  onVerify() {
    
  }

}
