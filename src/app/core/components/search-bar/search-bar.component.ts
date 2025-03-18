import { Component } from '@angular/core';
import { BookService, IFilter } from '../../services/book.service';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  search = '';
  filter: IFilter = {};

  constructor(private booksService: BookService) {
    booksService.$activeFilter.subscribe((res) => (this.filter = res));
  }

  onInput() {
    this.filter.title = this.search;
    // this.filter.author = this.search;
    // this.filter.category = this.search;
    // this.filter.description = this.search;
    this.booksService.query(this.filter);
  }
}
