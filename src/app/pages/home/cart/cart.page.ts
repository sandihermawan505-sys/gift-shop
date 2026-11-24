import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel, IonButton, IonIcon, IonCard, IonImg, IonThumbnail, IonText, IonCol, IonRow, IonListHeader, IonList, IonItemGroup, IonFooter, IonModal, IonItemDivider } from '@ionic/angular/standalone';
import type { Subscription } from 'rxjs';

import { Strings } from '../../../enum/strings.enum';
import { AddressService } from '../../../services/address/address.service';
import { CartService } from '../../../services/cart/cart.service';

import { AddAddressComponent } from './components/add-address/add-address.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { CouponsComponent } from './components/coupons/coupons.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonItemDivider, IonModal, IonFooter, IonItemGroup, IonList, IonListHeader, 
            IonRow, IonCol, IonText, IonImg, IonCard, IonIcon, IonButton, 
            IonLabel, IonItem, IonBackButton, IonButtons, IonContent, 
            IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
            IonThumbnail, DecimalPipe, CouponsComponent, AddAddressComponent,
            AddressesComponent
          ],
})

export class CartPage implements OnInit, OnDestroy {

  // @ViewChild('coupon_modal') coupon_modal!: IonModal;
  @ViewChild('add_address_modal') add_address_modal!: IonModal;
  @ViewChild('address_modal') address_modal!: IonModal;
  previous!: string;
  cartSub!: Subscription;
  selectedCoupon: any = null;
  applyCoupon = false;
  isAddAddress = false;
  isSelectAddress = false;
  isCheckoutToShippingAddress = false;
  address!: any;
  model: any = null;
  currency = Strings.CURRENCY;
  addresses: any[] = [];
  addressSub!: Subscription;
  private router = inject(Router);
  public cartService = inject(CartService);
  private addressService = inject(AddressService);
  
  constructor() {
    // console.log('constructor cartservice');
    // this.getCart();
  }

  ngOnInit(): void {
    this.checkUrl();

    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.model = cart;
      },
    });

    this.getAddresses();

    this.addressSub = this.addressService.addresses.subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      }
    });
  }

  async getAddresses(): Promise<void> {
    try {
      const addresses: any[] = await this.addressService.getAddresses();

      if (addresses?.length > 0) {
        this.address = addresses.find((address) => address.primary);
      }
    } catch (e) {
      console.log(e);
    }
  }

  checkUrl(): void {
    const route_url = this.router.url;
    const urlParts = route_url.split('/');
    urlParts.pop(); // Remove the last segment
    console.log(urlParts);
    this.previous = urlParts.join('/');
    console.log('url: ', this.previous);
  }

  addQuantity(item: any):any {
    this.cartService.addQuantity(item);
  }

  subtractQuantity(item: any):any {
    this.cartService.subtractQuantity(item);
  }

  closeCouponModal(coupon: any, couponModal: IonModal): void {
    console.log('coupon data: ', coupon);
    if (coupon) {
      this.selectedCoupon = coupon;
      this.model.grandTotal -= this.selectedCoupon?.saved;
    }
    couponModal.dismiss();
  }
  
  removeCoupon():any {
    this.model.grandTotal += this.selectedCoupon?.saved;
    this.selectedCoupon = null;
  }

  checkout(): void {
    if(!this.address){
      this.isAddAddress = true;
      this.isCheckoutToShippingAddress = true;
    } else {
      // navigate to payment page
      this.navigateToPayout();
    }
  }

  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe();
    if(this.addressSub) this.addressSub.unsubscribe();
  }

  closeAddAddressModal(data: any): void {
    console.log(data);
    this.add_address_modal.dismiss();
    if(data) {
      this.address = data;
      // Navigate to payment
      this.isCheckoutToShippingAddress = false;
      this.navigateToPayout();
    }
  }

  navigateToPayout(): void {
    
  }
  
  closeAddressModal(data: any): void {
    this.address_modal.dismiss();
    if(data) {
      if(data == 1) {
        this.isAddAddress = true;
      }
      this.address = data;
    }
  }
}
