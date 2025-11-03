/**
 * Session Management Utility
 * Handles user session timeout, activity tracking, and auto-logout
 */

import { env } from '../config/env';
import { logActivity } from './activityLogger';

export interface SessionData {
  userId: string;
  sessionId: string;
  loginTime: number;
  lastActivity: number;
  deviceInfo: string;
  ipAddress?: string;
}

class SessionManager {
  private sessionTimeoutMinutes: number;
  private activityCheckInterval: NodeJS.Timeout | null = null;
  private sessionData: SessionData | null = null;
  private onSessionExpired: (() => void) | null = null;

  constructor() {
    this.sessionTimeoutMinutes = env.security.sessionTimeoutMinutes;
  }

  /**
   * Initialize a new session
   */
  initSession(userId: string, onExpired: () => void): void {
    const sessionId = this.generateSessionId();

    this.sessionData = {
      userId,
      sessionId,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      deviceInfo: this.getDeviceInfo(),
    };

    this.onSessionExpired = onExpired;

    // Log session start
    logActivity({
      userId,
      action: 'session_started',
      metadata: {
        sessionId,
        deviceInfo: this.sessionData.deviceInfo,
      },
    });

    // Save session to localStorage
    this.saveSession();

    // Start activity monitoring
    this.startActivityMonitoring();

    // Set up activity listeners
    this.setupActivityListeners();
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.sessionData) {
      logActivity({
        userId: this.sessionData.userId,
        action: 'session_ended',
        metadata: {
          sessionId: this.sessionData.sessionId,
          duration: Date.now() - this.sessionData.loginTime,
        },
      });
    }

    this.clearSession();
    this.stopActivityMonitoring();
    this.removeActivityListeners();
  }

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();
      this.saveSession();
    }
  }

  /**
   * Check if session is still valid
   */
  isSessionValid(): boolean {
    if (!this.sessionData) {
      return false;
    }

    const inactiveTime = Date.now() - this.sessionData.lastActivity;
    const timeoutMs = this.sessionTimeoutMinutes * 60 * 1000;

    return inactiveTime < timeoutMs;
  }

  /**
   * Get remaining session time in minutes
   */
  getRemainingTime(): number {
    if (!this.sessionData) {
      return 0;
    }

    const inactiveTime = Date.now() - this.sessionData.lastActivity;
    const timeoutMs = this.sessionTimeoutMinutes * 60 * 1000;
    const remainingMs = Math.max(0, timeoutMs - inactiveTime);

    return Math.floor(remainingMs / 60000);
  }

  /**
   * Get current session data
   */
  getSessionData(): SessionData | null {
    return this.sessionData;
  }

  /**
   * Private: Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Private: Get device information
   */
  private getDeviceInfo(): string {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    return `${platform} - ${ua.substring(0, 100)}`;
  }

  /**
   * Private: Save session to localStorage
   */
  private saveSession(): void {
    if (this.sessionData) {
      localStorage.setItem('session', JSON.stringify(this.sessionData));
    }
  }

  /**
   * Private: Load session from localStorage
   */
  loadSession(): SessionData | null {
    try {
      const stored = localStorage.getItem('session');
      if (stored) {
        this.sessionData = JSON.parse(stored);
        return this.sessionData;
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  }

  /**
   * Private: Clear session data
   */
  private clearSession(): void {
    this.sessionData = null;
    localStorage.removeItem('session');
  }

  /**
   * Private: Start monitoring for session timeout
   */
  private startActivityMonitoring(): void {
    // Check session validity every minute
    this.activityCheckInterval = setInterval(() => {
      if (!this.isSessionValid()) {
        this.handleSessionExpired();
      }
    }, 60000); // Check every minute
  }

  /**
   * Private: Stop activity monitoring
   */
  private stopActivityMonitoring(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
  }

  /**
   * Private: Handle session expiration
   */
  private handleSessionExpired(): void {
    if (this.sessionData) {
      logActivity({
        userId: this.sessionData.userId,
        action: 'session_expired',
        metadata: {
          sessionId: this.sessionData.sessionId,
          inactiveTime: Date.now() - this.sessionData.lastActivity,
        },
      });
    }

    this.clearSession();
    this.stopActivityMonitoring();
    this.removeActivityListeners();

    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }

  /**
   * Private: Set up event listeners for user activity
   */
  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, this.handleUserActivity);
    });
  }

  /**
   * Private: Remove activity event listeners
   */
  private removeActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.removeEventListener(event, this.handleUserActivity);
    });
  }

  /**
   * Private: Handle user activity event
   */
  private handleUserActivity = (): void => {
    this.updateActivity();
  };
}

// Export singleton instance
export const sessionManager = new SessionManager();
