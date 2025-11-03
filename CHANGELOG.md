# Changelog

All notable changes to ALFRED will be documented in this file.

---

## [2.1.0] - Phase 2 Preparation - 2025-11-03

### 🎨 Rebranding
- **Changed name from "Pennyworth" to "ALFRED"**
  - ALFRED = Automated Lifestyle & Financial Resource Executive Director
  - Updated all branding throughout the application
  - Changed color scheme from yellow (#fbbf24) to blue (#60a5fa)
  - Updated app title and welcome messages
  - Modified sidebar and navigation branding

### 🔒 Security Enhancements
- **Implemented Single-User Mode**
  - Added `VITE_AUTHORIZED_EMAIL` environment variable
  - Only specified email can sign in when configured
  - Sign-up functionality hidden in single-user mode
  - Email validation on login attempts
  - Hidden dev signup mode (for testing purposes)
  - Shows "Single-user mode enabled" indicator

### 🔌 N8N Integration
- **Local Docker Integration Configured**
  - Default N8N webhook URL: `http://localhost:5678/webhook`
  - Updated environment configuration
  - Created comprehensive setup guide (`N8N_SETUP.md`)
  - Step-by-step Docker installation instructions
  - Multiple deployment options (simple, compose, with PostgreSQL)
  - Example workflows and troubleshooting guide

### 📝 Documentation
- **Created N8N Setup Guide** (`N8N_SETUP.md`)
  - Docker installation methods
  - Webhook configuration
  - Integration testing procedures
  - Example workflows
  - Troubleshooting section
  - Best practices

### 🔧 Configuration Updates
- **Environment Variables**
  - Added `VITE_AUTHORIZED_EMAIL` for single-user mode
  - Updated N8N webhook URL to local Docker default
  - Updated `.env.example` with new variables
  - Added TypeScript definitions for new env vars

### 📦 Files Modified
- `.env` - Added authorized email and N8N local URL
- `.env.example` - Updated with ALFRED branding and new fields
- `index.html` - Changed title to "ALFRED - Personal Automation System"
- `src/App.tsx` - Updated branding from Pennyworth to ALFRED
- `src/components/AuthModal.jsx` - Implemented single-user mode
- `src/config/env.ts` - Added authorizedEmail field
- `src/vite-env.d.ts` - Added VITE_AUTHORIZED_EMAIL type definition

### 📚 Files Created
- `N8N_SETUP.md` - Comprehensive N8N Docker integration guide
- `CHANGELOG.md` - This file

---

## [2.0.0] - Phase 1 Complete - 2025-11-03

### 🏗️ Modular Architecture
- Created extensible module system with hot enable/disable
- Module Manager for centralized control
- Plugin-based architecture for easy additions
- Module categories: Financial, Smart Home, Automation, etc.

### 🏠 Smart Home Integration
- Smart Home module with device management
- Support for Alexa-enabled devices (Roku bulbs, SmartRent)
- Device control: lights, locks, thermostat
- Quick actions: All on/off, scenes, routines
- Smart Home Dashboard UI with real-time controls

### ⚡ Automation & Workflows
- Automation module with workflow engine
- N8N integration for advanced workflows
- Multiple trigger types: manual, time, event, webhook
- Example workflow: Goodnight Routine
- Workflow execution system

### 🔒 Security Enhancements
- Enhanced Firestore security rules with granular controls
- Session management with auto-logout (30 min default)
- Activity logging system for audit trail
- Session timeout warnings
- Device fingerprinting
- Immutable activity logs

### ⚙️ Environment Configuration
- Centralized environment variable management
- TypeScript type-safe config access
- Secrets management structure
- Support for N8N, Alexa, security settings

### 📱 UI/UX Updates
- Added Smart Home navigation item
- Smart Home Dashboard component
- Device cards with real-time status
- Quick automation workflow cards
- Responsive grid layouts

---

## [1.0.0] - Initial Release

### 💰 Financial Management
- Expense tracking with categories
- Income management
- Budget planning and monitoring
- Savings goals
- Loan and credit card tracking
- Financial analytics and insights
- Export to CSV/PDF

### 🔐 Authentication
- Firebase Authentication
- Email/Password sign-in
- Google OAuth integration
- User profile management

### 📊 Analytics
- Visual charts and graphs
- Monthly/yearly reports
- Category breakdown
- Trend analysis

---

## Upcoming Features

### Phase 2 (In Progress)
- [ ] Visual Workflow Builder UI (React Flow)
- [ ] Local workflow execution engine (without N8N dependency)
- [ ] Command Center style dashboard redesign
- [ ] Multi-Factor Authentication (MFA)
- [ ] IP Whitelisting
- [ ] Real Alexa API integration
- [ ] Real SmartRent API integration

### Phase 3 (Future)
- [ ] Calendar & Task Management module
- [ ] Health & Fitness Tracking module
- [ ] Travel Management module
- [ ] Shopping & Inventory module
- [ ] News & Information Aggregator
- [ ] Vehicle Management module
- [ ] Voice Command Interface
- [ ] Mobile App (React Native)
- [ ] Notification System

---

## Notes

- All smart home devices are currently simulated
- Real API integration requires Alexa Developer account
- N8N integration ready and documented
- Security rules need Firebase deployment
- Build and production deployment ready

---

**Version**: 2.1.0
**Release Date**: November 3, 2025
**Codename**: ALFRED
