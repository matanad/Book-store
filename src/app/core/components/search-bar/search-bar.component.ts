import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { IBooksFilter } from '../../models/book.model';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  search = '';
  filter: IBooksFilter = {};
  filterType = 'title';

  constructor(private booksService: BookService) {
    booksService.$activeFilter.subscribe((filter) => {
      this.filter = filter;
      if (this.filter.title) {
        this.search = this.filter.title;
        this.filterType = 'title';
      }
      if (this.filter.author) {
        this.search = this.filter.author;
        this.filterType = 'author';
      }
      if (this.filter.category) {
        this.search = this.filter.category;
        this.filterType = 'category';
      }
    });
  }

  onInput() {
    this.filter[this.filterType] = this.search;
    this.booksService.query(this.filter);
  }
}
