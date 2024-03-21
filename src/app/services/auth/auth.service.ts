import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService
  ) { }

  async login(email: string, password: string): Promise<any> {
    // call login api
    return await this.storage.setStorage('uid', 'SDADSAJKDSJ')
  }

  async getId() {
    return (await this.storage.getStorage('uid')).value;
  }

  register() {

  }

  resetPassword() {

  }

  logOut() {

  }
}
