import { inject, Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Observable } from 'rxjs';

import { Strings } from '../../enum/strings.enum';
import { StorageService } from '../storage/storage.service';

@Service()
export class CartService {

  model: any = null;
  total_delivery_charge = 100;
  tax = 5; // in percentage;
  cartStoreName = Strings.CART_STORAGE;
  currency = Strings.CURRENCY;
  private storage = inject(StorageService);
  
  private _cart = new BehaviorSubject<any>(null);

  get cart(): Observable<any> {
      return this._cart.asObservable();
  }

  constructor() {
    console.log('constructor cartservice');
    this.getCart();
  }

  // addQuantity(item: any) {
  // const data = this._cart.value;
  // const totalItem = (data?.totalItem || 0) + 1;
  // this._cart.next({ totalItem });
  // }
  
  addQuantity(item: any): any {
    if(this.model) {

      const index = this.model.items.findIndex((data: any) => data.id == item.id);

      if(index >= 0) {
        this.model.items[index].quantity += 1;
      } else {
        const items = [{...item, quantity: 1}];
        this.model.items = items.concat(this.model.items);
      }

    } else {
      this.model = {
        items: [{...item, quantity: 1}]
      };
    }

    return this.calculate();
  }

  subtractQuantity(item: any): any {
    if(this.model) {
      const index = this.model.items.findIndex((data: any) => data.id == item.id);

      if(index >= 0) {
        if(this.model.items[index]?.quantity > 0) {
          this.model.items[index].quantity -= 1;
        }

        return this.calculate();
      }
    }
    return null;
  }

    calculate(): any {
    const items = this.model.items.filter((item: any) => item.quantity > 0);

    if(items?.length == 0) {
      this.clearCart();
      return;
    }

    let totalItem = 0;
    let totalPrice = 0;

    for (const element of items) {
      totalItem += element.quantity;
      totalPrice += element.price * element.quantity;
    }

    const tax = totalPrice * (this.tax / 100);

    const grandTotal = totalPrice + this.total_delivery_charge + tax;

    this.model = { 
      ...this.model, 
      totalItem, 
      totalPrice, 
      total_delivery_charge: this.total_delivery_charge,
      tax,
      grandTotal,
    };

    this._cart.next(this.model);
    this.saveCart(this.model);

    console.log(this.model);

    return this.model;
  }
    
    saveCart(data: any): void {
    const model = JSON.stringify(data);
    this.storage.setStorage(this.cartStoreName, model);
    }

    clearCart(): void {
    this.storage.removeStorage(this.cartStoreName);
    this.model = null;
    this._cart.next(null);
    }

    async getCart(): Promise<any> {
    let data: any = this._cart.value;

    if(!data) {
      data = await this.storage.getStorage(this.cartStoreName);
      console.log(data);
      if(data?.value) {
        this.model = JSON.parse(data.value);
        this._cart.next(this.model);
      }
    }
    console.log('get cart', this.model);

    return this.model;
  }
}
