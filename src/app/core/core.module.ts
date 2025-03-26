import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RouterModule } from '@angular/router';
import { CartButtonComponent } from './components/cart-button/cart-button.component';
import { SerachTabComponent } from './components/serach-tab/serach-tab.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    CartButtonComponent,
    SerachTabComponent,
    PageNotFoundComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, CartButtonComponent],
})
export class CoreModule {}
