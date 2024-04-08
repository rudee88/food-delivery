import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() profile;
  isSubmitted = false;
  @ViewChild('phoneInput') phoneInput;

  constructor(
    private profileService: ProfileService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.phoneInput.setFocus();
      console.log('enter');
    },500);
  }

  async onSubmit(form: NgForm) {
    try {
      if (!form.valid) {
        return;
      }
      console.log(form.value);
      this.isSubmitted = true;
      if (this.profile.email != form.value.email) {
        this.presentPasswordPrompt(form.value);
      } else {
        await this.profileService.updatePhoneNumber(form.value.phone);
        this.globalService.modalDismiss();
        this.isSubmitted = false;
      }
    } catch (e) {
      console.log(e);
      let msg = null;
      if (e?.error?.message) msg = e.error.message;
      this.isSubmitted = false;
      this.globalService.errorToast(msg);
    }
  }

  presentPasswordPrompt(data) {
    this.globalService.showAlert(
      'Please enter password',
      'Verify',
      [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Confirm cancel')
          this.isSubmitted = false;
        },
        
      },
      {
        text: 'Verify',
        handler: (inputData) => {
          console.log(inputData.password);
          if (inputData.password.trim() != 0 && inputData.password.length >= 8) {
            //update email with phone number
            this.updateEmail(data, inputData.password);
          } else {
            this.globalService.errorToast('Password must be of atleast 8 characters');
            this.isSubmitted = false;
          }
        },
        
      }],
      [{
        name: 'password',
        type: 'password',
        placeHolder: 'Enter Password'
      }]
    );
  }

  async updateEmail(data, password) {
    try {
      const profile_data = {
        phone: data.phone,
        email: data.email,
        password: password
      }
        await this.profileService.updateProfile(profile_data);
        this.globalService.modalDismiss(true);
        this.isSubmitted = false;
    } catch (e) {
      console.log(e);
      let msg = null;
      if (e?.error?.message) msg = e.error.message;
      this.isSubmitted = false;
      this.globalService.errorToast(msg);
    }
  }

}
