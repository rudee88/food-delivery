import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
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
      this.router.navigateByUrl('/tabs');
      this.isLoading = false;
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
    });
  }

}
