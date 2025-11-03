/**
 * Smart Home Module
 * Manages smart home devices, scenes, and automations
 * Integrates with Alexa, Roku lights, and SmartRent
 */

import { Module, ModuleCategory, ModuleMetadata, ModuleAction } from '../../types/module';
import { Home, Lightbulb, Lock, Thermometer } from 'lucide-react';

const metadata: ModuleMetadata = {
  id: 'smart_home',
  name: 'Smart Home',
  description: 'Control lights, locks, thermostat, and other smart devices',
  version: '1.0.0',
  author: 'ATLAS',
  category: ModuleCategory.SMART_HOME,
  icon: Home,
  enabled: true,
  dependencies: [],
};

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'lock' | 'thermostat' | 'sensor' | 'other';
  manufacturer: string;
  status: 'online' | 'offline';
  state: any;
}

class SmartHomeModule implements Module {
  metadata = metadata;
  private devices: Map<string, SmartDevice> = new Map();

  async initialize(config: any) {
    console.log('Smart Home module initialized with config:', config);

    // Initialize default devices
    // Note: These will be replaced with actual API integrations
    this.setupDefaultDevices();
  }

  async cleanup() {
    console.log('Smart Home module cleanup');
    this.devices.clear();
  }

  private setupDefaultDevices() {
    // Roku Bulbs (2)
    this.devices.set('roku_bulb_1', {
      id: 'roku_bulb_1',
      name: 'Roku Light 1',
      type: 'light',
      manufacturer: 'Roku',
      status: 'online',
      state: { on: false, brightness: 100, color: '#FFFFFF' },
    });

    this.devices.set('roku_bulb_2', {
      id: 'roku_bulb_2',
      name: 'Roku Light 2',
      type: 'light',
      manufacturer: 'Roku',
      status: 'online',
      state: { on: false, brightness: 100, color: '#FFFFFF' },
    });

    // Amazon Basics Bulb
    this.devices.set('amazon_bulb_1', {
      id: 'amazon_bulb_1',
      name: 'Amazon Light',
      type: 'light',
      manufacturer: 'Amazon Basics',
      status: 'online',
      state: { on: false, brightness: 100 },
    });

    // SmartRent devices (placeholders - will be configured later)
    this.devices.set('smartrent_lock', {
      id: 'smartrent_lock',
      name: 'Front Door Lock',
      type: 'lock',
      manufacturer: 'SmartRent',
      status: 'online',
      state: { locked: true },
    });

    this.devices.set('smartrent_thermostat', {
      id: 'smartrent_thermostat',
      name: 'Thermostat',
      type: 'thermostat',
      manufacturer: 'SmartRent',
      status: 'online',
      state: { temperature: 72, mode: 'auto' },
    });
  }

  getActions(): ModuleAction[] {
    return [
      {
        id: 'toggle_light',
        name: 'Toggle Light',
        description: 'Turn a light on or off',
        icon: Lightbulb,
        handler: async (params: { deviceId: string; on?: boolean }) => {
          const device = this.devices.get(params.deviceId);
          if (!device || device.type !== 'light') {
            throw new Error('Device not found or not a light');
          }

          const newState = params.on ?? !device.state.on;
          device.state.on = newState;

          console.log(`Light ${params.deviceId} turned ${newState ? 'on' : 'off'}`);

          return { success: true, state: device.state };
        },
        requiredParams: ['deviceId'],
      },
      {
        id: 'set_brightness',
        name: 'Set Brightness',
        description: 'Adjust light brightness (0-100)',
        icon: Lightbulb,
        handler: async (params: { deviceId: string; brightness: number }) => {
          const device = this.devices.get(params.deviceId);
          if (!device || device.type !== 'light') {
            throw new Error('Device not found or not a light');
          }

          device.state.brightness = Math.max(0, Math.min(100, params.brightness));

          console.log(`Light ${params.deviceId} brightness set to ${device.state.brightness}`);

          return { success: true, state: device.state };
        },
        requiredParams: ['deviceId', 'brightness'],
      },
      {
        id: 'lock_door',
        name: 'Lock Door',
        description: 'Lock or unlock a smart lock',
        icon: Lock,
        handler: async (params: { deviceId: string; lock?: boolean }) => {
          const device = this.devices.get(params.deviceId);
          if (!device || device.type !== 'lock') {
            throw new Error('Device not found or not a lock');
          }

          const locked = params.lock ?? true;
          device.state.locked = locked;

          console.log(`Lock ${params.deviceId} ${locked ? 'locked' : 'unlocked'}`);

          return { success: true, state: device.state };
        },
        requiredParams: ['deviceId'],
      },
      {
        id: 'set_temperature',
        name: 'Set Temperature',
        description: 'Set thermostat temperature',
        icon: Thermometer,
        handler: async (params: { deviceId: string; temperature: number }) => {
          const device = this.devices.get(params.deviceId);
          if (!device || device.type !== 'thermostat') {
            throw new Error('Device not found or not a thermostat');
          }

          device.state.temperature = params.temperature;

          console.log(`Thermostat ${params.deviceId} set to ${params.temperature}°F`);

          return { success: true, state: device.state };
        },
        requiredParams: ['deviceId', 'temperature'],
      },
      {
        id: 'all_lights_off',
        name: 'All Lights Off',
        description: 'Turn off all lights',
        handler: async () => {
          let count = 0;
          for (const [id, device] of this.devices.entries()) {
            if (device.type === 'light') {
              device.state.on = false;
              count++;
            }
          }

          console.log(`Turned off ${count} lights`);

          return { success: true, count };
        },
      },
      {
        id: 'all_lights_on',
        name: 'All Lights On',
        description: 'Turn on all lights',
        handler: async () => {
          let count = 0;
          for (const [id, device] of this.devices.entries()) {
            if (device.type === 'light') {
              device.state.on = true;
              count++;
            }
          }

          console.log(`Turned on ${count} lights`);

          return { success: true, count };
        },
      },
    ];
  }

  // Get all devices
  getDevices(): SmartDevice[] {
    return Array.from(this.devices.values());
  }

  // Get device by ID
  getDevice(deviceId: string): SmartDevice | undefined {
    return this.devices.get(deviceId);
  }

  async getStatus() {
    const devices = Array.from(this.devices.values());
    const onlineCount = devices.filter(d => d.status === 'online').length;

    return {
      healthy: true,
      message: `${onlineCount}/${devices.length} devices online`,
      lastUpdated: new Date(),
      metrics: {
        totalDevices: devices.length,
        onlineDevices: onlineCount,
        lights: devices.filter(d => d.type === 'light').length,
        locks: devices.filter(d => d.type === 'lock').length,
      },
    };
  }
}

export default new SmartHomeModule();
