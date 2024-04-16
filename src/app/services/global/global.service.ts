import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?, buttonArray?, inputs?) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttonArray ? buttonArray : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  async toastDismiss(data?) {
    await this.toastCtrl.dismiss(data);
  }

  async showButtonToast(msg, color = 'danger', position?) {
    const toast = await this.toastCtrl.create({
      // header: 'Alert',
      message: msg,
      color: color,
      position: position || 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'VERIFY',
          handler: () => {
            this.toastDismiss(true);
          }
        },
        {
          side: 'start',
          icon: 'close-circle',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Clicked')
          }
        }
      ]
    });
    await toast.present();
    const { data } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', data);
    if (data) return data;
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(msg ? msg : 'No internet Connection', 'danger', 'bottom', duration);
  }

  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  showLoader(msg?, spinner?) {
    // this.isLoading = true;
    if (!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg,
      spinner: spinner ? spinner : 'bubbles'
    }).then(res => {
      res.present().then(() => {
        if (!this.isLoading) {
          res.dismiss().then(() => {
            console.log('abort presenting');
          })
        }
      })
    })
    .catch(e => {
      console.log('show loading error:', e);
    });
  }

  hideLoader() {
    // this.isLoading = false;
    if (this.isLoading) this.setLoader();
    this.loadingCtrl.dismiss().then(() => {
      console.log('dissmissed');
    }).catch(e => {
      console.log('error hide loader:', e);
    });
  }

  async createModal(option) {
    const modal = await this.modalCtrl.create(option);
    await modal.present();
    const {data} = await modal.onWillDismiss();
    console.log(data);
    if (data) return data;
  }

  modalDismiss(val?) {
    let data: any = val ? val : null;
    console.log('data:', data);
    this.modalCtrl.dismiss(data);
  }

  getIcon(title) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline'
      default: return 'location-outline';
    }
  }


}
