import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../../animations/animations';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-screen',
  standalone: false,
  templateUrl: './auth-screen.component.html',
  styleUrl: './auth-screen.component.scss',
  animations: [fadeAnimation],
})
export class AuthScreenComponent implements OnInit, OnDestroy {
  protected data: string = '';
  subscription: Subscription = new Subscription();
  isAdminRoute: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.checkAdminRoute();
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.data = this.route.firstChild?.snapshot.data['title'] || 'Auth';
      });
  }

  checkAdminRoute(): void {
    this.isAdminRoute = this.router.url.includes('/admin');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
