import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { map, take } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import validator from 'validator';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  editUserForm!: FormGroup;
  firstName!: AbstractControl | null;
  lastName!: AbstractControl | null;
  email!: AbstractControl | null;
  password!: AbstractControl | null;
  confirmPassword!: AbstractControl | null;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.$currentUser.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
    this.initFb();
  }

  initFb() {
    this.editUserForm = this.fb.group({
      firstName: new FormControl(this.user.firstName, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl(this.user.lastName, [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(this.user.email, [
        Validators.required,
        this.emailValidator,
      ]),
      password: new FormControl('', []),
      confirmPassword: new FormControl('', []),
    });

    this.firstName = this.editUserForm.get('firstName');
    this.lastName = this.editUserForm.get('lastName');
    this.email = this.editUserForm.get('email');
    this.password = this.editUserForm.get('password');
    this.confirmPassword = this.editUserForm.get('confirmPassword');

    this.editUserForm.controls?.['password'].valueChanges.subscribe(
      (change) => {
        console.log(change);
      }
    );
  }

  emailValidator(control: FormGroup): ValidationErrors | null {
    const email = control?.value;
    if (email == undefined) return null;
    return !validator.isEmail(email) ? { invalidEmail: true } : null;
  }

  strongPasswordValidator(control: FormGroup): ValidationErrors | null {
    const password = control.value;
    return !validator.isStrongPassword(password)
      ? { weakPassword: true }
      : null;
  }

  confirmPasswordValidator(control: FormGroup): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;
    return password !== confirmPassword ? { passwordnotrepeated: true } : null;
  }

  getEmailErrorMessage(): string {
    const errors = this.email?.errors;
    if (errors?.['required']) return 'Please enter your email address.';
    if (errors?.['invalidEmail'])
      return 'Invalid email. Use a valid format like name@example.com.';
    return '';
  }

  getPasswordErrorMessage(): string {
    const errors = this.password?.errors;
    if (errors?.['required']) return 'Please enter a password.';
    if (errors?.['weakPassword'])
      return 'Password must be at least 8 characters with an uppercase letter, a number, and a special character.';
    return '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.confirmPassword?.errors?.['required'])
      return 'Please confirm your password.';
    if (this.confirmPassword?.errors?.['passwordnotrepeated'])
      return 'Passwords must match.';
    return '';
  }
}
