import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isAdminRoute = false;
  email: string = '';
  password: string = '';
  isUserValid = false;
  failMsg = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.checkAdminRoute();
  }

  checkAdminRoute(): void {
    this.isAdminRoute = this.router.url.includes('/admin');
  }

  handleSubmit(form: NgForm) {
    this.isUserValid = true;
    this.userService
      .login(this.email, this.password, this.isAdminRoute)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res) {
            this.router.navigate(['/']);
          } else {
            this.isUserValid = false;
          }
        },
        (err) => (this.failMsg = err)
      );
  }

  getLoginFailedMsg(msg: string = '') {
    if (msg === '')
      return 'The email or password you entered is incorrect. Please try again.';
    return msg;
  }
}
