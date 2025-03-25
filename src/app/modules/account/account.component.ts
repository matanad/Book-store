import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { first, map, take } from 'rxjs';
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
    this.userService.$currentUser.subscribe({
      next: (user) => {
        this.user = user;
        this.initFb();
      },
    });
  }

  onSubmit() {
    const user = { ...this.user };
    user.email = this.email?.value;
    user.firstName = this.firstName?.value;
    user.lastName = this.lastName?.value;
    this.userService
      .updateUserDetails(user)
      .pipe(take(1))
      .subscribe({
        next: () => {
          console.log('scc', this.email?.errors);
        },
        error: (err) => {
          console.error(err);
          this.email?.setErrors({ emailExist: true });
        },
      });
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
        this.emailExistValidator,
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.minLength(0)
        this.strongPasswordValidator,
      ]),
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

  emailExistValidator(control: FormGroup): ValidationErrors | null {
    let isEmailExist = false;
    // if (control.valid) {
    //   this.userService.isEmailExist(this.user.id, this.email?.value).subscribe({
    //     error: () => (isEmailExist = true),
    //   });
    // }
    return null;
  }

  onCancelChanges() {
    const userData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: '',
      confirmPassword: '',
    };
    this.editUserForm.setValue(userData);
  }

  onLogout() {
    this.userService.logout();
  }

  onDelete() {
    this.userService.delete(this.user.id);
  }

  emailValidator(control: FormGroup): ValidationErrors | null {
    const email = control?.value;
    if (email == undefined) return null;
    return !validator.isEmail(email) ? { invalidEmail: true } : null;
  }

  strongPasswordValidator(control: FormGroup): ValidationErrors | null {
    const password: string = control.value;
    if (password == undefined || password.trim() == '') return null;
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
    if (errors?.['emailExist']) {
      console.log('exist');

      return 'Email is alraedy exist.';
    }
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
