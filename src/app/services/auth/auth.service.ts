import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
<<<<<<< HEAD
import { ApiService } from '../api/api.service';
=======
import { AngularFireAuth } from '@angular/fire/compat/auth';
>>>>>>> master

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService,
<<<<<<< HEAD
    private api: ApiService
=======
    private fireAuth: AngularFireAuth
>>>>>>> master
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
<<<<<<< HEAD
      const data = {
        email: formValue.email,
        phone: formValue.phone,
        name: formValue.name,
        type: 'user',
        status: 'active',
        password: formValue.password
      };

      const response = this.api.post('user/signup', data);
      console.log(response);
      return response;
    } catch(e) {
      throw(e)
=======
      const register = this.fireAuth.createUserWithEmailAndPassword(formValue.email, formValue.password);
      console.log('registered user: ', register);
    } catch(e) {
      throw(e);
>>>>>>> master
    }
  }

  async resetPassword(email: string) {
    return await email;
  }

  logOut() {

  }
}
