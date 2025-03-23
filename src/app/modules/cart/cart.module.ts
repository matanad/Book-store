import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartViewComponent } from './components/cart-view/cart-view.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CartComponent, CartViewComponent],
  imports: [CommonModule, CartRoutingModule, SharedModule],
})
export class CartModule {}
