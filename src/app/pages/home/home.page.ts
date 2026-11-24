import { Component, inject } from '@angular/core';
import type { OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonTitle,
  IonToolbar, IonContent, IonCol, IonRow, IonCard, IonThumbnail, IonImg, IonLabel, IonText, IonIcon,
  IonSearchbar, IonBadge, IonButtons, IonButton } from '@ionic/angular/standalone';
import type { Subscription } from 'rxjs';

import { ApiService } from '../../services/api/api.service';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonButtons, IonBadge, IonRow, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonThumbnail, IonImg, IonLabel, IonText, IonIcon, 
    IonSearchbar, RouterLink],
})

export class HomePage implements OnInit, OnDestroy {

  items: any[] = [];
  allItems: any[] = [];
  query!: string;
  totalItems = 0;
  cartSub!: Subscription;
  private api = inject(ApiService);
  public cartService = inject(CartService);

  constructor() {}

  ngOnInit(): void {
    console.log('ngoninit homepage');
    this.getItems();

    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        this.totalItems = cart ? cart?.totalItem : 0;
      }
    });
  }

  
  getItems(): void {
    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }

  onSearchChange(event: any): void  {
    console.log(event.detail.value);

    this.query = event.detail.value.toLowerCase();
    this.querySearch();
  }

  querySearch(): void {
    this.items = [];
    if (this.query.length > 0) {
      this.searchItems();
    } else {
      this.items = [...this.allItems];
    }
  }

    searchItems(): void {
    this.items = this.api.items.filter((item) =>
      item.name.toLowerCase().includes(this.query)
    );
  }

  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}
