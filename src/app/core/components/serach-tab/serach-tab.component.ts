import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-serach-tab',
  standalone: false,
  templateUrl: './serach-tab.component.html',
  styleUrl: './serach-tab.component.scss',
})
export class SerachTabComponent {
  @Input() generes!: string[];
  @Output() onSearch = new EventEmitter();

  constructor(private router: Router) {}

  onGenereClick(category: string) {
    this.onSearch.emit(category);
    this.router.navigate(['']);
  }
}
