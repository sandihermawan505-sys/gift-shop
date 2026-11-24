import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { IonContent, IonToolbar, IonTitle, IonHeader, IonButtons, 
  IonButton, IonIcon, IonList, IonInput, IonTextarea, IonRow, IonCol, 
  IonItem, IonLabel, 
  IonToggle, IonText, IonSpinner } from '@ionic/angular/standalone';

import { AddressService } from '../../../../../services/address/address.service';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonText, IonCol, IonTextarea,
    IonInput,
    IonList,
    IonIcon,
    IonButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule, IonRow, IonItem, IonLabel,
    IonToggle
  ],
})

export class AddAddressComponent 
// implements OnInit 
{
  form!: FormGroup;
  @Output() addAddressClosed: EventEmitter<any> = new EventEmitter();
  isLoading = false;
  private addressService = inject(AddressService);

  constructor() {
    this.initForm();
  }

  // ngOnInit(): void {}

  initForm(): void {
    this.form = new FormGroup({
      pincode: new FormControl(null, {validators: [Validators.required] }),
      address: new FormControl(null, {validators: [Validators.required] }),
      house_no: new FormControl(null, {validators: [Validators.required] }),
      city: new FormControl(null, {validators: [Validators.required] }),
      state: new FormControl(null, {validators: [Validators.required] }),
      country: new FormControl(null, {validators: [Validators.required] }),
      save_as: new FormControl(null, {validators: [Validators.required] }),
      landmark: new FormControl(null, {validators: [] }),
      primary: new FormControl(null, {validators: [] }),
    });
  }
  dismiss(data?: any):any {
    this.addAddressClosed.emit(data);
  }

  async save(): Promise<any> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.addAddressClosed.emit(this.form.value);
    // this.dismiss(this.form.value);
  }

  async addAddress(data: any): Promise<void> {
    try {
      const address = await this.addressService.addAddress(data);
      this.dismiss(address);
    } catch(e) {
      console.log(e);
    }
  }

}
