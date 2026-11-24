import { Component, Input, Output, EventEmitter 
} from '@angular/core';
import { IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonHeader, IonContent, IonList, IonRadioGroup, IonItem, IonLabel, IonRadio } from "@ionic/angular/standalone";
// import { addIcons } from 'ionicons';
// import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  standalone: true,
  imports: [IonRadio, IonLabel, IonItem, IonRadioGroup, IonList, IonContent, IonHeader, IonIcon, IonButton, IonButtons, IonTitle, IonToolbar, ],
})
export class AddressesComponent  // implements OnInit 
{
  @Input() addresses: any[] = [];
  @Output() addressesClosed: EventEmitter<any> = new EventEmitter();

  constructor() {
    // addIcons({ closeOutline });
  }

  // ngOnInit() {}

  dismiss(data?:any):void {
    this.addressesClosed.emit(data);
  }

  // selectAddress(address: any) :any {
  //   this.dismiss(address);
  // }
}
