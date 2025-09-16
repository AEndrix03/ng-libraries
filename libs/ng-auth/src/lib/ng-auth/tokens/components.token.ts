import { InjectionToken } from '@angular/core';
import { LoginComponentConfig } from '../components/login/login.component';

export const AUTH_LOGIN_COMPONENT_CONFIG = new InjectionToken<
  Partial<LoginComponentConfig>
>('AUTH_LOGIN_COMPONENT_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    title: 'Welcome Back!',
    subtitle: 'Please login to your account',
    showRememberMe: true,
    showForgotPassword: true,
    showCreateAccount: true,
    iconCard: 'pi pi-wallet text-3xl text-white',
    logoCard: null,
    logoStyle: 'w-10 h-10',
    showAppleLogin: true,
    showGoogleLogin: true,
    showGithubLogin: true,
  }),
});

export function provideLoginComponentConfig(
  config: Partial<LoginComponentConfig>
) {
  return { provide: AUTH_LOGIN_COMPONENT_CONFIG, useValue: config };
}
