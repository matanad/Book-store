import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { IBooksFilter } from '../../models/book.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  filter: IBooksFilter = {};
  generes: string[] = [];
  currUesr: User = {} as User;
  search = '';
  filterType = 'title';
  menuOpen = false;

  constructor(
    private booksService: BookService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filter = {
        author: params['author'] ?? '',
        category: params['category'] ?? '',
        page: params['page'] ? +params['page'] : 1,
      };

      this.booksService.fetchBooks(this.filter);
    });

    this.booksService.$activeFilter.subscribe((filter) => {
      this.filter = filter;
      this.updateFilterType();
    });
    this.booksService
      .getGeneres()
      .subscribe({ next: (generes) => (this.generes = generes) });
    this.userService.$currentUser.subscribe({
      next: (user) => (this.currUesr = user),
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  updateFilterType() {
    if (this.filter.title === '') {
      this.search = this.filter.title;
      this.filterType = 'title';
    }
    if (this.filter.author === '') {
      this.search = this.filter.author;
      this.filterType = 'author';
    }
    if (this.filter.category === '') {
      this.search = this.filter.category;
      this.filterType = 'category';
    }
    this.updateQueryFromFilter();
  }

  onInput(event: any) {
    this.booksService.fetchBooks(event);
  }
  onSearch(input: string) {
    this.booksService.fetchBooks({ category: input, page: 1 } as IBooksFilter);
  }

  resetSearchFitler() {
    this.booksService.fetchBooks({ page: 1 });
    this.updateQueryFromFilter();
  }

  updateQueryFromFilter() {
    const params = { ...this.filter };

    Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
