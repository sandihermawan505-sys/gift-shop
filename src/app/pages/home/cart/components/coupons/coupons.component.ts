import { DecimalPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonText,
  IonButton,
  IonIcon, IonButtons, IonGrid, IonSpinner } from '@ionic/angular/standalone';

import { Strings } from '../../../../../enum/strings.enum';
import { ApiService } from '../../../../../services/api/api.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonGrid, IonButtons, 
    IonIcon,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonCol,
    IonRow,
    IonCard,
    IonContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    NgClass,
    DecimalPipe,
  ],
})
export class CouponsComponent implements OnInit {

  @Input() orderTotal!: number;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  coupons: any[] = [];
  isLoading: boolean = false;
  currency = Strings.CURRENCY;
  private apiService = inject(ApiService);
  
  constructor() {}

  ngOnInit(): void {
    this.getCoupons();
  }

  async getCoupons(): Promise<void> {
    try {
      this.isLoading = true;
      const coupons = this.apiService.getCoupons();
      if (coupons.length > 0) {
        coupons.map((coupon: any) => {
          coupon.saved = this.getSavedAmount(coupon);
          return coupon;
        });
        this.coupons = [...coupons];
      }
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
      console.log(e);
    }
  }

  getSavedAmount(coupon: any): number {
    let amt: 0;
    if (coupon?.minimumOrderAmount) {
      amt = this.orderTotal - coupon.minimumOrderAmount;
      if (amt < 0) return amt;
    }
    amt = coupon?.isPercentage
      ? this.orderTotal * (coupon?.discount / 100)
      : coupon?.discount;
    if (coupon?.upto_discount) {
      console.log('check amt: ', amt);
      amt = amt >= coupon.upto_discount ? coupon.upto_discount : amt;
    }
    return amt;
  }

  closeModal(data?: any): void {
    this.closed.emit(data);
  }
}