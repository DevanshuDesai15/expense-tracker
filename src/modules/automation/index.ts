/**
 * Automation Module
 * Manages workflows, triggers, and N8N integration
 */

import { Module, ModuleCategory, ModuleMetadata, ModuleAction } from '../../types/module';
import { Zap } from 'lucide-react';
import { env } from '../../config/env';

const metadata: ModuleMetadata = {
  id: 'automation',
  name: 'Automation & Workflows',
  description: 'Create and manage automation workflows with N8N integration',
  version: '1.0.0',
  author: 'ATLAS',
  category: ModuleCategory.AUTOMATION,
  icon: Zap,
  enabled: true,
};

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  enabled: boolean;
  createdAt: Date;
  lastRun?: Date;
}

export interface WorkflowTrigger {
  type: 'time' | 'event' | 'webhook' | 'manual';
  config: any;
}

export interface WorkflowAction {
  moduleId: string;
  actionId: string;
  params: any;
}

class AutomationModule implements Module {
  metadata = metadata;
  private workflows: Map<string, Workflow> = new Map();
  private n8nWebhookUrl: string = '';
  private n8nApiKey: string = '';

  async initialize(config: any) {
    console.log('Automation module initialized');

    // Get N8N configuration
    this.n8nWebhookUrl = env.integrations.n8n.webhookUrl;
    this.n8nApiKey = env.integrations.n8n.apiKey;

    if (this.n8nWebhookUrl) {
      console.log('N8N integration configured');
    } else {
      console.warn('N8N webhook URL not configured');
    }

    // Load saved workflows from localStorage or database
    this.loadWorkflows();
  }

  async cleanup() {
    console.log('Automation module cleanup');
    this.workflows.clear();
  }

  private loadWorkflows() {
    // TODO: Load from Firestore
    // For now, create some example workflows
    const exampleWorkflow: Workflow = {
      id: 'goodnight_routine',
      name: 'Goodnight Routine',
      description: 'Turn off all lights, lock doors, and set thermostat',
      trigger: {
        type: 'manual',
        config: {},
      },
      actions: [
        {
          moduleId: 'smart_home',
          actionId: 'all_lights_off',
          params: {},
        },
        {
          moduleId: 'smart_home',
          actionId: 'lock_door',
          params: { deviceId: 'smartrent_lock', lock: true },
        },
        {
          moduleId: 'smart_home',
          actionId: 'set_temperature',
          params: { deviceId: 'smartrent_thermostat', temperature: 68 },
        },
      ],
      enabled: true,
      createdAt: new Date(),
    };

    this.workflows.set(exampleWorkflow.id, exampleWorkflow);
  }

  getActions(): ModuleAction[] {
    return [
      {
        id: 'run_workflow',
        name: 'Run Workflow',
        description: 'Execute a workflow by ID',
        handler: async (params: { workflowId: string }) => {
          return await this.executeWorkflow(params.workflowId);
        },
        requiredParams: ['workflowId'],
      },
      {
        id: 'create_workflow',
        name: 'Create Workflow',
        description: 'Create a new automation workflow',
        handler: async (params: Partial<Workflow>) => {
          const workflow: Workflow = {
            id: `workflow_${Date.now()}`,
            name: params.name || 'New Workflow',
            description: params.description || '',
            trigger: params.trigger || { type: 'manual', config: {} },
            actions: params.actions || [],
            enabled: params.enabled ?? true,
            createdAt: new Date(),
          };

          this.workflows.set(workflow.id, workflow);

          console.log(`Workflow created: ${workflow.id}`);

          return { success: true, workflow };
        },
        requiredParams: ['name'],
      },
      {
        id: 'trigger_n8n_webhook',
        name: 'Trigger N8N Webhook',
        description: 'Send data to N8N webhook',
        handler: async (params: any) => {
          return await this.triggerN8NWebhook(params);
        },
      },
    ];
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string): Promise<any> {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (!workflow.enabled) {
      throw new Error(`Workflow ${workflowId} is disabled`);
    }

    console.log(`Executing workflow: ${workflow.name}`);

    const results = [];

    // Execute each action in sequence
    for (const action of workflow.actions) {
      try {
        // This will use the ModuleManager to execute actions
        // For now, we'll just log it
        console.log(`Executing action: ${action.moduleId}.${action.actionId}`, action.params);

        results.push({
          moduleId: action.moduleId,
          actionId: action.actionId,
          success: true,
        });
      } catch (error) {
        console.error(`Action failed:`, error);
        results.push({
          moduleId: action.moduleId,
          actionId: action.actionId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Update last run time
    workflow.lastRun = new Date();

    return {
      success: true,
      workflow: workflow.name,
      results,
    };
  }

  /**
   * Trigger N8N webhook
   */
  async triggerN8NWebhook(data: any): Promise<any> {
    if (!this.n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured');
    }

    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.n8nApiKey && { 'X-N8N-API-KEY': this.n8nApiKey }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('N8N webhook triggered successfully');

      return { success: true, result };
    } catch (error) {
      console.error('N8N webhook error:', error);
      throw error;
    }
  }

  /**
   * Get all workflows
   */
  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  async getStatus() {
    const workflows = Array.from(this.workflows.values());
    const enabledCount = workflows.filter(w => w.enabled).length;

    return {
      healthy: true,
      message: `${enabledCount} active workflows`,
      lastUpdated: new Date(),
      metrics: {
        totalWorkflows: workflows.length,
        enabledWorkflows: enabledCount,
        n8nConfigured: !!this.n8nWebhookUrl,
      },
    };
  }
}

export default new AutomationModule();
