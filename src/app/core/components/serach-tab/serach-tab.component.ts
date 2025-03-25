import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-serach-tab',
  standalone: false,
  templateUrl: './serach-tab.component.html',
  styleUrl: './serach-tab.component.scss',
})
export class SerachTabComponent {
  @Input() generes!: string[];
}
