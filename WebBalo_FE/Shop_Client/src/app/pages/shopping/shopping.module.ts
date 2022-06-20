import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout/checkout.component';
import { RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AuthGuard } from 'src/app/core/auth.guard';
import { MyAccountComponent } from './my-account/my-account.component';

@NgModule({
  declarations: [
    CheckoutComponent,
    CartComponent,
    MyAccountComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    RouterModule.forChild([
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path:'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'my-account',
        component: MyAccountComponent
      },
    ])
  ]
})
export class ShoppingModule { }
