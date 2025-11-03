/**
 * Module Registry
 * Central place to import and register all modules
 */

import { moduleManager } from '../core/ModuleManager';
import FinancialModule from './financial';
import SmartHomeModule from './smartHome';
import AutomationModule from './automation';

/**
 * Initialize and register all modules
 */
export const initializeModules = async () => {
  console.log('Registering modules...');

  // Register all modules
  moduleManager.register(FinancialModule);
  moduleManager.register(SmartHomeModule);
  moduleManager.register(AutomationModule);

  // Initialize all registered modules
  await moduleManager.initializeAll();

  console.log('All modules registered and initialized');
};

/**
 * Export module manager for use throughout the app
 */
export { moduleManager };

/**
 * Export individual modules for direct access if needed
 */
export { FinancialModule, SmartHomeModule, AutomationModule };
