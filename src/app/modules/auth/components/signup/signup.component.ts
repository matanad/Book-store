import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';
import validator from 'validator';
import { take } from 'rxjs';
import { fadeAnimation } from '../../../../animations/animations';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [fadeAnimation],
})
export class SignupComponent {
  signupForm!: FormGroup;
  firstName!: AbstractControl | null;
  lastName!: AbstractControl | null;
  email!: AbstractControl | null;
  password!: AbstractControl | null;
  confirmPassword!: AbstractControl | null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, this.emailValidator]),
      password: new FormControl('', [
        Validators.required,
        this.strongPasswordValidator,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.confirmPasswordValidator,
      ]),
    });

    this.firstName = this.signupForm.get('firstName');
    this.lastName = this.signupForm.get('lastName');
    this.email = this.signupForm.get('email');
    this.password = this.signupForm.get('password');
    this.confirmPassword = this.signupForm.get('confirmPassword');
  }

  onSignUp() {
    if (this.signupForm.invalid) return;
    console.log(this.signupForm.value);
    
    this.userService
      .atteptAuth('', this.signupForm.value)
      .subscribe({ next: () => this.router.navigate(['']) });
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
