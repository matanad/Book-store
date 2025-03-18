import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SearchBarComponent],
  imports: [CommonModule, FormsModule],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {}
