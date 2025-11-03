/**
 * Module Manager
 * Central registry and manager for all automation modules
 */

import { Module, RegisteredModule, ModuleConfig, ModuleStatus } from '../types/module';

class ModuleManager {
  private modules: Map<string, RegisteredModule> = new Map();
  private initialized: boolean = false;

  /**
   * Register a new module
   */
  register(module: Module, config: ModuleConfig = {}): void {
    const { id } = module.metadata;

    if (this.modules.has(id)) {
      console.warn(`Module ${id} is already registered. Skipping...`);
      return;
    }

    this.modules.set(id, {
      module,
      config,
      enabled: module.metadata.enabled,
    });

    console.log(`Module registered: ${id}`);
  }

  /**
   * Unregister a module
   */
  async unregister(moduleId: string): Promise<void> {
    const registered = this.modules.get(moduleId);

    if (!registered) {
      console.warn(`Module ${moduleId} not found`);
      return;
    }

    // Clean up if module has cleanup method
    if (registered.module.cleanup) {
      await registered.module.cleanup();
    }

    this.modules.delete(moduleId);
    console.log(`Module unregistered: ${moduleId}`);
  }

  /**
   * Initialize all registered modules
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) {
      console.warn('Modules already initialized');
      return;
    }

    const initPromises: Promise<void>[] = [];

    for (const [id, registered] of this.modules.entries()) {
      if (registered.enabled && registered.module.initialize) {
        console.log(`Initializing module: ${id}`);
        initPromises.push(
          registered.module.initialize(registered.config).catch((error) => {
            console.error(`Failed to initialize module ${id}:`, error);
          })
        );
      }
    }

    await Promise.all(initPromises);
    this.initialized = true;
    console.log('All modules initialized');
  }

  /**
   * Enable a module
   */
  async enableModule(moduleId: string): Promise<void> {
    const registered = this.modules.get(moduleId);

    if (!registered) {
      throw new Error(`Module ${moduleId} not found`);
    }

    if (registered.enabled) {
      console.warn(`Module ${moduleId} is already enabled`);
      return;
    }

    // Initialize if needed
    if (registered.module.initialize) {
      await registered.module.initialize(registered.config);
    }

    registered.enabled = true;
    console.log(`Module enabled: ${moduleId}`);
  }

  /**
   * Disable a module
   */
  async disableModule(moduleId: string): Promise<void> {
    const registered = this.modules.get(moduleId);

    if (!registered) {
      throw new Error(`Module ${moduleId} not found`);
    }

    if (!registered.enabled) {
      console.warn(`Module ${moduleId} is already disabled`);
      return;
    }

    // Cleanup if needed
    if (registered.module.cleanup) {
      await registered.module.cleanup();
    }

    registered.enabled = false;
    console.log(`Module disabled: ${moduleId}`);
  }

  /**
   * Get a specific module
   */
  getModule(moduleId: string): Module | null {
    const registered = this.modules.get(moduleId);
    return registered ? registered.module : null;
  }

  /**
   * Get all registered modules
   */
  getAllModules(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get enabled modules
   */
  getEnabledModules(): RegisteredModule[] {
    return Array.from(this.modules.values()).filter((m) => m.enabled);
  }

  /**
   * Get modules by category
   */
  getModulesByCategory(category: string): RegisteredModule[] {
    return Array.from(this.modules.values()).filter(
      (m) => m.module.metadata.category === category
    );
  }

  /**
   * Update module configuration
   */
  async updateModuleConfig(moduleId: string, config: ModuleConfig): Promise<void> {
    const registered = this.modules.get(moduleId);

    if (!registered) {
      throw new Error(`Module ${moduleId} not found`);
    }

    registered.config = { ...registered.config, ...config };

    // Reinitialize if module is enabled
    if (registered.enabled && registered.module.initialize) {
      await registered.module.initialize(registered.config);
    }

    console.log(`Module config updated: ${moduleId}`);
  }

  /**
   * Get module configuration
   */
  getModuleConfig(moduleId: string): ModuleConfig | null {
    const registered = this.modules.get(moduleId);
    return registered ? registered.config : null;
  }

  /**
   * Execute a module action
   */
  async executeAction(moduleId: string, actionId: string, params?: any): Promise<any> {
    const module = this.getModule(moduleId);

    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    const actions = module.getActions?.() || [];
    const action = actions.find((a) => a.id === actionId);

    if (!action) {
      throw new Error(`Action ${actionId} not found in module ${moduleId}`);
    }

    console.log(`Executing action: ${moduleId}.${actionId}`);
    return await action.handler(params);
  }

  /**
   * Get status of all modules
   */
  async getAllModuleStatuses(): Promise<Map<string, ModuleStatus>> {
    const statuses = new Map<string, ModuleStatus>();

    for (const [id, registered] of this.modules.entries()) {
      if (registered.enabled && registered.module.getStatus) {
        try {
          const status = await registered.module.getStatus();
          statuses.set(id, status);
        } catch (error) {
          console.error(`Failed to get status for module ${id}:`, error);
          statuses.set(id, {
            healthy: false,
            message: 'Failed to get status',
            lastUpdated: new Date(),
          });
        }
      }
    }

    return statuses;
  }

  /**
   * Trigger automation across modules
   */
  async triggerAutomation(triggerType: string, data: any): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [id, registered] of this.modules.entries()) {
      if (registered.enabled && registered.module.handleTrigger) {
        promises.push(
          registered.module.handleTrigger(triggerType, data).catch((error) => {
            console.error(`Module ${id} failed to handle trigger ${triggerType}:`, error);
          })
        );
      }
    }

    await Promise.all(promises);
  }

  /**
   * Check if module manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const moduleManager = new ModuleManager();
export default moduleManager;
