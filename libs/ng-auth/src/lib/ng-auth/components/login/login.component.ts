import {
  Component,
  Inject,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, filter, finalize } from 'rxjs/operators';
import { of, tap } from 'rxjs';
import { LoginRequestDto } from '../../models/login.models';
import { AuthEventsService } from '../../services/event/auth-event.service';
import { AuthenticationService } from '../../services/authentication.service';
import { PRAETOR_LOGIN_EFFECTS } from '../../tokens/effects.token';
import { LoginFormComponent } from './form/login-form.component';
import { AUTH_LOGIN_COMPONENT_CONFIG } from '../../tokens/components.token';

@Component({
  selector: 'ar-login',
  imports: [Toast, ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login.component.html',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      /* Modern Toast Styling */
      .modern-toast .p-toast-message {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modern-toast .p-toast-message.p-toast-message-success {
        background: rgba(34, 197, 94, 0.1);
        border-color: rgba(34, 197, 94, 0.3);
      }

      .modern-toast .p-toast-message.p-toast-message-error {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
      }

      .modern-toast .p-toast-message-content {
        padding: 1.25rem;
      }

      .modern-toast .p-toast-summary {
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
      }

      .modern-toast .p-toast-detail {
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .modern-toast .p-toast-icon {
        font-size: 1.25rem;
        margin-right: 0.75rem;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class LoginComponent {
  public readonly loading: WritableSignal<boolean> = signal(false);

  constructor(
    @Inject(PRAETOR_LOGIN_EFFECTS) private readonly loginEffect: (() => void)[],
    @Inject(AUTH_LOGIN_COMPONENT_CONFIG)
    protected readonly config: Partial<LoginComponentConfig>,
    private readonly messageService: MessageService,
    private readonly authenticationService: AuthenticationService,
    private readonly authEventService: AuthEventsService
  ) {}

  doLogin(request: LoginRequestDto) {
    this.loading.set(true);
    this.authenticationService
      .login(request)
      .pipe(
        catchError(() => {
          this.showError();
          return of(null);
        }),
        filter((payload) => payload != null),
        tap(() => this.showSuccess()),
        tap((payload) => this.authEventService.emitLoginSuccess(payload)),
        tap(() => this.loginEffect?.forEach((fn) => fn())),
        finalize(() => this.loading.set(false))
      )
      .subscribe();
  }

  doChangePassword() {
    /*this.praetorActionsService.emitChangePasswordAction();*/
  }

  private showSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Welcome back!',
      detail: 'You have successfully signed in to your account',
      life: 4000,
    });
  }

  private showError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Authentication failed',
      detail: 'Please check your email and password and try again',
      life: 5000,
    });
  }
}

export interface LoginComponentConfig {
  title: string;
  subtitle: string;
  showRememberMe: boolean;
  showForgotPassword: boolean;
  showCreateAccount: boolean;
  iconCard: string;
  logoCard: string | null;
  logoStyle: string;
  showAppleLogin: boolean;
  showGoogleLogin: boolean;
  showGithubLogin: boolean;
}
