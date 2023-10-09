import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  form: FormGroup
  location_name: string = 'Locating...';

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', {validators: [Validators.required]}),
      house: new FormControl('', {validators: [Validators.required]}),
      landmark: new FormControl('', {validators: [Validators.required]}),
    })
  }

}
