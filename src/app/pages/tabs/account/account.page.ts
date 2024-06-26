import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { OrderService } from 'src/app/services/order/order.service';
import { CartService } from '../../../services/cart/cart.service';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  @ViewChild('otp_modal') modal: ModalController;
  isLoading: boolean;
  profile: any = {};
  orders: Order[] = [];
  ordersSub: Subscription;
  profileSub: Subscription;
  verifyOtp = false;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private globalService: GlobalService,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(
      (order) => {
        console.log('order data: ', order);
        this.orders = order;
      },
      (e) => {
        console.log(e);
      }
    );
    this.profileSub = this.profileService.profile.subscribe((profile) => {
      this.profile = profile;
      console.log(profile);
    });
    this.getData();
  }

  async getData() {
    try {
      await this.profileService.getProfile();
      this.isLoading = true;
      setTimeout(async () => {
        await this.orderService.getOrders();
        this.isLoading = false;
      }, 1000);
    } catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }

  async onReorder(order: Order) {
    console.log(order);
    let data: any = await this.cartService.getCart();
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }

  async onEditProfile() {
    const options = {
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile,
      },
      cssClass: 'custom-modal',
      swipeToClose: true,
    };
    const modal = await this.globalService.createModal(options);
    if (modal) {
      this.verifyOtp = true;
    }
  }

  onGetHelp(order) {
    console.log(order);
  }

  onLogout() {
    this.authService.logOut();
  }

  onResetOtpModal(value) {
    console.log('value, ',value);
    this.verifyOtp = false;
  }

  onOtpVerified(event) {
    if (event) this.modal.dismiss();
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
  }
}
