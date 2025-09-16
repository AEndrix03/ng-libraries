import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { BackgroundDecorComponent } from '../../background-decor/background-decor.component';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

@Component({
  selector: 'ar-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    DividerModule,
    RippleModule,
    MessageModule,
    BackgroundDecorComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginFormComponent implements OnInit {
  @Input() title: string | undefined | null = 'Welcome Back!';
  @Input() subtitle: string | undefined | null = 'Please login to your account';
  @Input() showRememberMe: boolean | undefined | null = true;
  @Input() showForgotPassword: boolean | undefined | null = true;
  @Input() showCreateAccount: boolean | undefined | null = true;
  @Input() iconCard: string | undefined | null =
    'pi pi-wallet text-3xl text-white';
  @Input() logoCard: string | undefined | null = null;
  @Input() logoStyle: string | undefined | null = 'w-10 h-10';
  @Input() showAppleLogin: boolean | undefined | null = true;
  @Input() showGoogleLogin: boolean | undefined | null = true;
  @Input() showGithubLogin: boolean | undefined | null = true;

  @Output() login = new EventEmitter<LoginCredentials>();
  @Output() createAccount = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();

  loginForm!: FormGroup;

  // State Signals
  loading = signal(false);
  showPassword = signal(false);
  loginAttempts = signal(0);

  // Focus States
  emailFocused = signal(false);
  passwordFocused = signal(false);

  // Error State
  showErrors = signal(false);
  serverError = signal<string>('');

  // Computed values
  isFormValid = computed(() => this.loginForm?.valid ?? false);

  emailErrors = computed(() => {
    const control = this.loginForm?.get('email');
    if (!control || !control.touched) return [];

    const errors: string[] = [];
    if (control.errors?.['required']) errors.push('Email is required');
    if (control.errors?.['email']) errors.push('Please enter a valid email');
    if (control.errors?.['pattern']) errors.push('Email format is invalid');

    return errors;
  });

  passwordErrors = computed(() => {
    const control = this.loginForm?.get('password');
    if (!control || !control.touched) return [];

    const errors: string[] = [];
    if (control.errors?.['required']) errors.push('Password is required');
    if (control.errors?.['minlength']) {
      errors.push(
        `Password must be at least ${control.errors['minlength'].requiredLength} characters`
      );
    }

    return errors;
  });

  // Password strength computed
  passwordStrength = computed(() => {
    const password = this.loginForm?.get('password')?.value || '';
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedEmail();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  private loadSavedEmail(): void {
    try {
      const savedEmail = localStorage.getItem('remembered_email');
      if (savedEmail) {
        this.loginForm.patchValue({
          email: savedEmail,
          rememberMe: true,
        });
      }
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  onSubmit(): void {
    // Mark all as touched to show validation
    this.loginForm.markAllAsTouched();
    this.showErrors.set(true);

    if (this.loginForm.invalid) {
      this.shakeForm();
      return;
    }

    this.loading.set(true);
    this.serverError.set('');

    const credentials: LoginCredentials = {
      email: this.loginForm.get('email')?.value.trim().toLowerCase(),
      password: this.loginForm.get('password')?.value,
      rememberMe: this.loginForm.get('rememberMe')?.value,
    };

    // Handle remember me
    if (credentials.rememberMe) {
      this.saveEmail(credentials.email);
    } else {
      this.clearSavedEmail();
    }

    // Simulate API call
    setTimeout(() => {
      this.login.emit(credentials);
      this.loading.set(false);
      this.loginAttempts.update((v) => v + 1);
    }, 1000);
  }

  private saveEmail(email: string): void {
    try {
      localStorage.setItem('remembered_email', email);
    } catch (e) {
      // Silently fail
    }
  }

  private clearSavedEmail(): void {
    try {
      localStorage.removeItem('remembered_email');
    } catch (e) {
      // Silently fail
    }
  }

  private shakeForm(): void {
    const form = document.getElementById('login-form');
    if (form) {
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  }

  onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  onCreateAccount(): void {
    this.createAccount.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  clearServerError(): void {
    this.serverError.set('');
  }

  // Helper methods for template
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  get rememberMeControl() {
    return this.loginForm.get('rememberMe');
  }
}
