# Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- (Optional) N8N instance for workflow automation
- (Optional) Alexa Developer account for future API integration

---

## Installation Steps

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file is already configured with your Firebase credentials. Customize these additional settings:

```env
# Security Settings
VITE_ENABLE_MFA=true                    # Enable Multi-Factor Authentication (coming in Phase 2)
VITE_SESSION_TIMEOUT_MINUTES=30         # Session timeout in minutes
VITE_MAX_LOGIN_ATTEMPTS=5               # Max failed login attempts

# VPN/IP Whitelisting (optional)
VITE_ALLOWED_IP_RANGES=                 # Comma-separated IPs (leave empty to disable)

# N8N Integration (optional)
VITE_N8N_WEBHOOK_URL=                   # Your N8N webhook URL
VITE_N8N_API_KEY=                       # Your N8N API key (if required)

# App Branding
VITE_APP_NAME=ATLAS                     # Change to your chosen name
```

### 3. Firebase Setup

Your Firebase project is already configured (`pennyworth-bf5bf`). Ensure Firestore and Authentication are enabled in Firebase Console.

#### Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

#### Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to Firebase Hosting

```bash
firebase deploy
```

---

## Initial Setup

### First Login

1. Open the app
2. Click "Begin Service"
3. Sign up with email/password or use Google Sign-In
4. Complete the onboarding wizard
5. You'll be logged in with a 30-minute session

### Configure Smart Home Devices

Currently, the app has placeholder devices configured:

**Lights:**
- Roku Light 1
- Roku Light 2
- Amazon Light

**Smart Lock:**
- Front Door Lock (SmartRent)

**Thermostat:**
- Thermostat (SmartRent)

These are currently simulated. To connect real devices, you'll need to:

1. Set up Alexa Developer account
2. Create an Alexa Smart Home skill
3. Link your devices to the skill
4. Configure OAuth credentials in `.env`

(Detailed instructions coming in Phase 2)

### Test the Smart Home Dashboard

1. Navigate to "Smart Home" in the sidebar
2. Try toggling lights on/off
3. Adjust thermostat
4. Lock/unlock the door
5. Use "All On" / "All Off" buttons
6. Execute the "Goodnight Routine" workflow

### Set Up N8N Integration (Optional)

1. Install N8N (self-hosted or cloud):
   ```bash
   npx n8n
   ```

2. Create a webhook workflow in N8N

3. Copy the webhook URL to `.env`:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-webhook-id
   ```

4. Test the integration from the app

---

## Module System Overview

### Available Modules

1. **Financial Management** (Active)
   - Expense tracking
   - Income management
   - Budget planning

2. **Smart Home** (Active)
   - Device control
   - Scene management
   - Quick actions

3. **Automation** (Active)
   - Workflow creation
   - N8N integration
   - Scheduled tasks

### Accessing Modules

Navigate using the sidebar:
- Dashboard - Overview of all modules
- Smart Home - Control devices
- Expenses - Track expenses
- Income - Manage income
- Analytics - Financial insights
- Financial Planning - Budgets & goals
- Profile - Settings & configuration

---

## Security Features

### Session Management

- **Auto-logout**: After 30 minutes of inactivity (configurable)
- **Warning**: 5 minutes before session expires
- **Activity tracking**: Mouse, keyboard, scroll events extend session
- **Device fingerprinting**: Track login devices

### Activity Logging

All actions are logged to Firestore:
- Authentication events
- Device control
- Data modifications
- Security events

View logs in Firebase Console:
```
Firestore > activityLogs/{userId}/logs
```

### Firestore Security

All data is user-specific and protected by security rules:
- Users can only access their own data
- Activity logs are immutable
- Default deny for unlisted resources

---

## Troubleshooting

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Firebase Connection Issues

1. Check Firebase credentials in `.env`
2. Ensure Firestore and Auth are enabled in Firebase Console
3. Check browser console for errors
4. Verify security rules are deployed

### Session Timeout Issues

Adjust timeout in `.env`:
```env
VITE_SESSION_TIMEOUT_MINUTES=60  # Increase to 60 minutes
```

### Module Not Loading

1. Check browser console for errors
2. Verify module is registered in `src/modules/index.ts`
3. Check module's `initialize()` method
4. Ensure dependencies are installed

---

## Development Workflow

### Adding a New Module

1. Create module directory:
   ```bash
   mkdir src/modules/yourModule
   ```

2. Create module file: `src/modules/yourModule/index.ts`

3. Implement the module interface

4. Register in `src/modules/index.ts`:
   ```typescript
   import YourModule from './yourModule';
   moduleManager.register(YourModule);
   ```

5. Restart dev server

### Modifying Smart Home Devices

Edit `src/modules/smartHome/index.ts`:

```typescript
private setupDefaultDevices() {
  this.devices.set('new_device_id', {
    id: 'new_device_id',
    name: 'Device Name',
    type: 'light', // or 'lock', 'thermostat', 'sensor', 'other'
    manufacturer: 'Brand Name',
    status: 'online',
    state: { /* device-specific state */ },
  });
}
```

### Creating Workflows

Programmatically via module action:

```typescript
import { moduleManager } from './modules';

await moduleManager.executeAction('automation', 'create_workflow', {
  name: 'My Workflow',
  description: 'Description',
  trigger: {
    type: 'manual',
    config: {}
  },
  actions: [
    {
      moduleId: 'smart_home',
      actionId: 'all_lights_off',
      params: {}
    }
  ],
  enabled: true
});
```

---

## Next Steps

1. **Choose your system name** (ATLAS, ALFRED, etc.)
2. **Connect real smart devices** (Phase 2)
3. **Set up N8N** for advanced automation
4. **Enable MFA** when implemented
5. **Configure IP whitelisting** if needed
6. **Add more modules** as needed

---

## Getting Help

- Check `AUTOMATION_SYSTEM.md` for detailed documentation
- Review Firebase Console for logs and errors
- Check browser developer console for frontend errors
- Review module source code in `src/modules/`

---

## Important Files

- `.env` - Environment configuration (DO NOT COMMIT)
- `firestore.rules` - Database security rules
- `src/modules/` - All automation modules
- `src/core/ModuleManager.ts` - Module system core
- `src/config/env.ts` - Environment variable access
- `AUTOMATION_SYSTEM.md` - Full system documentation

---

**Ready to automate your life! 🚀**
