import { UpperCasePipe } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavController, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonItem, IonLabel, IonText, IonFooter, IonButton, IonBadge } from '@ionic/angular/standalone';
import type { Subscription } from 'rxjs';

// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
  imports: [IonBadge, IonButton, IonFooter, IonText, IonLabel, IonItem, IonIcon, IonBackButton,
    IonContent, IonHeader,
    IonToolbar, RouterLink,
    //  CommonModule, FormsModule, 
    IonButtons, UpperCasePipe],
})
export class ItemDetailPage implements OnInit, OnDestroy {

  id!: string;
  item: any;
  addToBag!: any;
  totalItems = 0;
  cartSub!: Subscription;
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private api = inject(ApiService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getItem();

    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        console.log(cart);
        this.totalItems = cart ? cart?.totalItem : 0;
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id', id);
    if (!id || id == '0') {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    
    this.item = this.api.items.find((record) => record.id == id);
    console.log(this.item);
  }

  async addItem(): Promise<void> {
    await this.cartService.addQuantity(this.item);
    this.addedText();
  }

   getItem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if (!id || id == '0') {
      this.navCtrl.back();
      return;
    }
    this.id = id;

    this.item = this.api.items.find((record: any) => record.id == id);
    console.log(this.item);
  }

  addedText(): void {
    this.addToBag = 'Added to Bag';
    setTimeout(() => {
      this.addToBag = null;
      this.cdr.detectChanges();
    }, 1000);
  }
  ngOnDestroy(): void {
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}
