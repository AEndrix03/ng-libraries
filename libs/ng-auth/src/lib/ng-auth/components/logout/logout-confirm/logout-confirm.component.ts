import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'ar-logout-confirm',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  template: `
    <div class="modern-logout-container">
      <!-- Background Elements -->
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <!-- Main Card -->
      <div class="logout-card">
        <!-- Header with animated icon -->
        <div class="logout-header">
          <div class="logout-icon-container">
            <div class="logout-icon-ring">
              <i class="pi pi-sign-out"></i>
            </div>
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
          <h1 class="logout-title">Sign Out</h1>
          <p class="logout-subtitle">Are you sure you want to leave?</p>
        </div>

        <!-- Message -->
        <div class="logout-message">
          <div class="message-card">
            <div class="message-icon">
              <i class="pi pi-info-circle"></i>
            </div>
            <div class="message-content">
              <p class="message-text">
                You will be signed out of your current session and redirected to the login page.
              </p>
              <p class="message-subtext">
                Your work has been automatically saved.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="logout-actions">
          <button
            pButton
            pRipple
            type="button"
            class="cancel-btn"
            icon="pi pi-arrow-left"
            label="Stay Signed In"
            (click)="cancelLogout.emit()"
          ></button>

          <button
            pButton
            pRipple
            type="button"
            class="confirm-btn"
            icon="pi pi-sign-out"
            label="Sign Out"
            (click)="confirmLogout.emit()"
          ></button>
        </div>

        <!-- Quick Actions Footer -->
        <div class="logout-footer">
          <div class="quick-actions">
            <button type="button" class="quick-action" pRipple>
              <i class="pi pi-lock"></i>
              <span>Lock Screen</span>
            </button>
            <button type="button" class="quick-action" pRipple>
              <i class="pi pi-user"></i>
              <span>Switch User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './logout-confirm.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LogoutConfirmComponent {
  @Output() confirmLogout = new EventEmitter<void>();
  @Output() cancelLogout = new EventEmitter<void>();
}
