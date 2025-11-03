/**
 * Activity Logger Utility
 * Logs user activities for security audit and analytics
 */

import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ActivityLog {
  userId: string;
  action: string;
  timestamp?: any;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log a user activity
 */
export const logActivity = async (activity: ActivityLog): Promise<void> => {
  try {
    const { userId, action, metadata = {} } = activity;

    const logEntry = {
      userId,
      action,
      timestamp: serverTimestamp(),
      metadata,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };

    // Log to Firestore
    await addDoc(collection(db, `activityLogs/${userId}/logs`), logEntry);

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('[Activity Log]:', action, metadata);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging failures shouldn't break the app
  }
};

/**
 * Log authentication events
 */
export const logAuthEvent = async (
  userId: string,
  event: 'login' | 'logout' | 'login_failed' | 'mfa_enabled' | 'mfa_disabled' | 'password_changed',
  metadata?: Record<string, any>
): Promise<void> => {
  await logActivity({
    userId,
    action: `auth_${event}`,
    metadata,
  });
};

/**
 * Log data access events
 */
export const logDataAccess = async (
  userId: string,
  collection: string,
  operation: 'read' | 'create' | 'update' | 'delete',
  documentId?: string
): Promise<void> => {
  await logActivity({
    userId,
    action: `data_${operation}`,
    metadata: {
      collection,
      documentId,
    },
  });
};

/**
 * Log security events
 */
export const logSecurityEvent = async (
  userId: string,
  event: 'suspicious_activity' | 'unauthorized_access' | 'ip_blocked' | 'rate_limit_exceeded',
  metadata?: Record<string, any>
): Promise<void> => {
  await logActivity({
    userId,
    action: `security_${event}`,
    metadata,
  });
};

/**
 * Log automation events
 */
export const logAutomationEvent = async (
  userId: string,
  workflowId: string,
  event: 'started' | 'completed' | 'failed',
  metadata?: Record<string, any>
): Promise<void> => {
  await logActivity({
    userId,
    action: `automation_${event}`,
    metadata: {
      workflowId,
      ...metadata,
    },
  });
};

/**
 * Log smart home events
 */
export const logSmartHomeEvent = async (
  userId: string,
  deviceId: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> => {
  await logActivity({
    userId,
    action: `smarthome_${action}`,
    metadata: {
      deviceId,
      ...metadata,
    },
  });
};
