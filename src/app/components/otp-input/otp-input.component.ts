import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
})
export class OtpInputComponent  implements OnInit {
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input-style'
  }
  @Output() otp: EventEmitter<any> = new EventEmitter();
  @Output() length: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.length.emit(this.config.length);
  }

  onOtpChange(otp) {
    this.otp.emit(otp);
  }

}
