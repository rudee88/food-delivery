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
        await this.profileService.updateProfile(this.profile, form.value);
        this.globalService.modalDismiss();
        this.isSubmitted = false;
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }
}
