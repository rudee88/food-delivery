import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
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

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) return;
    this.login(form);
  }

  login(form) {
    this.isLogin = true;
  }

}
