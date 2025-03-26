import { Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-serach-tab',
  standalone: false,
  templateUrl: './serach-tab.component.html',
  styleUrl: './serach-tab.component.scss',
})
export class SerachTabComponent {
  @Input() generes!: string[];
  @Output() onSearch = new EventEmitter();

  onGenereClick(category: string) {
    this.onSearch.emit(category);
  }
}
