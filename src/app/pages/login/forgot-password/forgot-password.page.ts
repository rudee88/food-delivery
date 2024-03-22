import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private globalService: GlobalService,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log('form value: ', form.value);
    if(!form.valid) return;
    this.isLoading = true;
       this.authService.resetPassword(form.value.email).then(data => {
      console.log('data: ', data);
      this.isLoading = false;
      this.globalService.successToast('Reset Password Link is sent to your Email Address');
      this.navCtrl.back();
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
      this.globalService.showAlert('Something went wrong');
    })  
  }

}
