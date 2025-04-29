import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookService } from '../../services/book.service';
import { IBooksFilter } from '../../models/book.model';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  @Input() filter: IBooksFilter = {};
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Input() search = '';
  @Input() filterType = 'title';

  constructor() {}

  ngOnInit(): void {}

  changeSelectedFilter(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.filterType = selectedValue;
    this.onSearch.emit({
      [selectedValue]: this.search,
      page: 1,
    } as IBooksFilter);
  }

  onInput() {
    this.onSearch.emit({
      [this.filterType]: this.search,
      page: 1,
    } as IBooksFilter);
  }
}
