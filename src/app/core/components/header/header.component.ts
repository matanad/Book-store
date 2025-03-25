import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { IBooksFilter } from '../../models/book.model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  filter: IBooksFilter = {};
  generes: string[] = [];

  constructor(private booksService: BookService) {
    booksService.$activeFilter.subscribe((filter) => {
      this.filter = filter;
    });
    booksService
      .getGeneres()
      .subscribe({ next: (generes) => (this.generes = generes) });
  }
  ngOnInit(): void {}

  onInput(event: any) {
    this.booksService.query(this.filter);
  }
}
