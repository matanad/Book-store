import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) //  private userService: UserService
  {}

  ngOnInit(): void {}

  handleSubmit(form: NgForm) {
    // this.userService
    //   .login(this.email, this.password)
    //   .subscribe(({ success }) => {
    //     if (success) {
    //       this.isUserValid = true;
    //       this.router.navigate(['']);
    //     } else this.isUserValid = false;
    //   });
  }
}
