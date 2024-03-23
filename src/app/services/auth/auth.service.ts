import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
    private fireAuth: AngularFireAuth
  ) { }

  async login(email: string, password: string): Promise<any> {
    // call login api
    return await this.storage.setStorage('uid', 'SDADSAJKDSJ');
  }

  async getId() {
    return (await this.storage.getStorage('uid')).value;
  }

  async register(formValue) {
    try {
      const register = this.fireAuth.createUserWithEmailAndPassword(formValue.email, formValue.password);
      console.log('registered user: ', register);
    } catch(e) {
      throw(e);
    }
  }

  async resetPassword(email: string) {
    return await email;
  }

  logOut() {

  }
}
