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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
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
    // const user = { ...this.user };
    // user.email = this.email?.value;
    // user.firstName = this.firstName?.value;
    // user.lastName = this.lastName?.value;
    // if (this.password?.valid && this.confirmPassword?.valid)
    //   user.password = this.password.value;
    // else {
    //   this.snackBar.open('Your details are invalid!', 'Close', {
    //     duration: 3000,
    //     panelClass: ['success-snackbar'],
    //   });
    //   return;
    // }

    // this.userService
    //   .updateUserDetails(user)
    //   .pipe(take(1))
    //   .subscribe({
    //     next: () => {
    //       this.snackBar.open(
    //         'Your details have been successfully updated!',
    //         'Close',
    //         {
    //           duration: 3000,
    //           panelClass: ['success-snackbar'],
    //         }
    //       );
    //     },
    //     error: (err) => {
    //       console.error(err);
    //       this.email?.setErrors({ emailExist: true });
    //     },
    //   });
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
      password: new FormControl(
        '',
        Validators.compose([(control) => this.strongPasswordValidator(control)])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([
          (control) => this.confirmPasswordValidator(control),
        ])
      ),
    });

    this.firstName = this.editUserForm.get('firstName');
    this.lastName = this.editUserForm.get('lastName');
    this.email = this.editUserForm.get('email');
    this.password = this.editUserForm.get('password');
    this.confirmPassword = this.editUserForm.get('confirmPassword');
  }

  emailExistValidator(control: FormGroup): ValidationErrors | null {
    let isEmailExist = false;
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

    this.snackBar.open('Your changes have been canceled.', 'Close', {
      duration: 3000,
      panelClass: ['cancel-snack'],
    });
  }

  onLogout() {
    this.userService.purgeAuth();
  }

  onDelete() {
    // this.userService.delete(this.user.id);
    // this.snackBar.open('Your account has been deleted successfully!', 'Close', {
    //   duration: 3000,
    //   panelClass: ['success-snack'],
    // });
  }

  emailValidator(control: FormGroup): ValidationErrors | null {
    const email = control?.value;
    if (email == undefined) return null;
    return !validator.isEmail(email) ? { invalidEmail: true } : null;
  }

  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;
    if (password == undefined || password.trim() == '') return null;
    return !validator.isStrongPassword(password)
      ? { weakPassword: true }
      : null;
  }

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
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
