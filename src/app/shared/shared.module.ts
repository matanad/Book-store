import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrashBtnComponent } from './components/trash-btn/trash-btn.component';

@NgModule({
  declarations: [TrashBtnComponent],
  imports: [CommonModule],
  exports: [TrashBtnComponent],
})
export class SharedModule {}
