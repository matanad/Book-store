import { Component } from '@angular/core';
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
export class LoginComponent {
  email: string = '';
  password: string = '';
  isUserValid = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}

  handleSubmit(form: NgForm) {
    this.isUserValid = true;
    this.userService
      .login(this.email, this.password)
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/']);
        } else {
          this.isUserValid = false;
        }
      });
  }
}
