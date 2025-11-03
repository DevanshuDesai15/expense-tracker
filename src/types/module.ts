/**
 * Module System Type Definitions
 * Defines the interface for automation modules
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: ModuleCategory;
  icon: LucideIcon;
  enabled: boolean;
  requiredPermissions?: string[];
  dependencies?: string[];
}

export enum ModuleCategory {
  FINANCIAL = 'financial',
  SMART_HOME = 'smart_home',
  LIFESTYLE = 'lifestyle',
  AUTOMATION = 'automation',
  HEALTH = 'health',
  SECURITY = 'security',
  PRODUCTIVITY = 'productivity',
  OTHER = 'other',
}

export interface ModuleConfig {
  [key: string]: any;
}

export interface ModuleAction {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  handler: (params?: any) => Promise<any>;
  requiredParams?: string[];
}

export interface ModuleWidget {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  size?: 'small' | 'medium' | 'large';
  refreshInterval?: number; // in seconds
}

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
  name: string;
  icon?: LucideIcon;
}

export interface Module {
  metadata: ModuleMetadata;

  /**
   * Initialize the module
   */
  initialize?: (config: ModuleConfig) => Promise<void>;

  /**
   * Clean up resources when module is disabled
   */
  cleanup?: () => Promise<void>;

  /**
   * Get module configuration UI component
   */
  getConfigComponent?: () => React.ComponentType<any>;

  /**
   * Get main dashboard component
   */
  getDashboardComponent?: () => React.ComponentType<any>;

  /**
   * Get dashboard widgets
   */
  getWidgets?: () => ModuleWidget[];

  /**
   * Get available actions
   */
  getActions?: () => ModuleAction[];

  /**
   * Get module routes
   */
  getRoutes?: () => ModuleRoute[];

  /**
   * Handle automation triggers
   */
  handleTrigger?: (triggerType: string, data: any) => Promise<void>;

  /**
   * Get module health/status
   */
  getStatus?: () => Promise<ModuleStatus>;
}

export interface ModuleStatus {
  healthy: boolean;
  message?: string;
  lastUpdated: Date;
  metrics?: Record<string, any>;
}

export interface RegisteredModule {
  module: Module;
  config: ModuleConfig;
  enabled: boolean;
}
