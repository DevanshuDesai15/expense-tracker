import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, Lock, Thermometer, Power, Sun, Moon, Zap } from 'lucide-react';
import { moduleManager } from '../modules';
import SmartHomeModule from '../modules/smartHome';
import AutomationModule from '../modules/automation';
import type { SmartDevice } from '../modules/smartHome';
import type { Workflow } from '../modules/automation';

const SmartHomeDashboard: React.FC = () => {
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDevices(SmartHomeModule.getDevices());
    setWorkflows(AutomationModule.getWorkflows());
  };

  const handleToggleLight = async (deviceId: string) => {
    setLoading(true);
    try {
      await moduleManager.executeAction('smart_home', 'toggle_light', { deviceId });
      loadData(); // Refresh devices
    } catch (error) {
      console.error('Error toggling light:', error);
      alert('Failed to toggle light');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (deviceId: string) => {
    setLoading(true);
    try {
      const device = devices.find(d => d.id === deviceId);
      const lock = !device?.state.locked;
      await moduleManager.executeAction('smart_home', 'lock_door', { deviceId, lock });
      loadData();
    } catch (error) {
      console.error('Error toggling lock:', error);
      alert('Failed to toggle lock');
    } finally {
      setLoading(false);
    }
  };

  const handleAllLightsOff = async () => {
    setLoading(true);
    try {
      await moduleManager.executeAction('smart_home', 'all_lights_off', {});
      loadData();
    } catch (error) {
      console.error('Error turning off lights:', error);
      alert('Failed to turn off lights');
    } finally {
      setLoading(false);
    }
  };

  const handleAllLightsOn = async () => {
    setLoading(true);
    try {
      await moduleManager.executeAction('smart_home', 'all_lights_on', {});
      loadData();
    } catch (error) {
      console.error('Error turning on lights:', error);
      alert('Failed to turn on lights');
    } finally {
      setLoading(false);
    }
  };

  const handleRunWorkflow = async (workflowId: string) => {
    setLoading(true);
    try {
      await moduleManager.executeAction('automation', 'run_workflow', { workflowId });
      alert('Workflow executed successfully!');
    } catch (error) {
      console.error('Error running workflow:', error);
      alert('Failed to run workflow');
    } finally {
      setLoading(false);
    }
  };

  const renderDeviceIcon = (device: SmartDevice) => {
    switch (device.type) {
      case 'light':
        return <Lightbulb className={`w-6 h-6 ${device.state.on ? 'text-yellow-400' : 'text-gray-400'}`} />;
      case 'lock':
        return <Lock className={`w-6 h-6 ${device.state.locked ? 'text-green-400' : 'text-red-400'}`} />;
      case 'thermostat':
        return <Thermometer className="w-6 h-6 text-blue-400" />;
      default:
        return <Home className="w-6 h-6 text-gray-400" />;
    }
  };

  const renderDeviceControl = (device: SmartDevice) => {
    switch (device.type) {
      case 'light':
        return (
          <button
            onClick={() => handleToggleLight(device.id)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition-colors ${
              device.state.on
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
        );
      case 'lock':
        return (
          <button
            onClick={() => handleToggleLock(device.id)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition-colors ${
              device.state.locked
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {device.state.locked ? 'Locked' : 'Unlocked'}
          </button>
        );
      case 'thermostat':
        return (
          <div className="text-xl font-bold text-blue-400">
            {device.state.temperature}°F
          </div>
        );
      default:
        return null;
    }
  };

  const lights = devices.filter(d => d.type === 'light');
  const locks = devices.filter(d => d.type === 'lock');
  const thermostats = devices.filter(d => d.type === 'thermostat');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Home</h2>
          <p className="text-gray-400">Control your devices and automations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAllLightsOn}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            <Sun className="w-4 h-4" />
            <span>All On</span>
          </button>
          <button
            onClick={handleAllLightsOff}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Moon className="w-4 h-4" />
            <span>All Off</span>
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Lights */}
        {lights.map(device => (
          <div
            key={device.id}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {renderDeviceIcon(device)}
                <div>
                  <h3 className="font-medium text-white">{device.name}</h3>
                  <p className="text-sm text-gray-400">{device.manufacturer}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {device.state.on ? 'On' : 'Off'} • {device.state.brightness}%
              </span>
              {renderDeviceControl(device)}
            </div>
          </div>
        ))}

        {/* Locks */}
        {locks.map(device => (
          <div
            key={device.id}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {renderDeviceIcon(device)}
                <div>
                  <h3 className="font-medium text-white">{device.name}</h3>
                  <p className="text-sm text-gray-400">{device.manufacturer}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>
            <div className="flex items-center justify-end">
              {renderDeviceControl(device)}
            </div>
          </div>
        ))}

        {/* Thermostats */}
        {thermostats.map(device => (
          <div
            key={device.id}
            className="p-4 rounded-lg border"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {renderDeviceIcon(device)}
                <div>
                  <h3 className="font-medium text-white">{device.name}</h3>
                  <p className="text-sm text-gray-400">{device.manufacturer}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{device.state.mode}</span>
              {renderDeviceControl(device)}
            </div>
          </div>
        ))}
      </div>

      {/* Automation Workflows */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Quick Automations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map(workflow => (
            <button
              key={workflow.id}
              onClick={() => handleRunWorkflow(workflow.id)}
              disabled={loading || !workflow.enabled}
              className="p-4 rounded-lg border text-left transition-all hover:border-yellow-400 disabled:opacity-50"
              style={{ backgroundColor: '#1a1a1a', borderColor: '#333333' }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h4 className="font-medium text-white">{workflow.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{workflow.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartHomeDashboard;
