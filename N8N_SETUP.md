# N8N Local Docker Integration Guide

## Overview

This guide explains how to integrate N8N running on Docker locally with your ALFRED personal automation system.

---

## Prerequisites

- Docker installed on your system
- ALFRED application running
- Basic understanding of webhooks

---

## Step 1: Run N8N in Docker

### Option A: Simple Docker Run (Recommended for beginners)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

This command:
- Runs N8N on port 5678
- Persists data to `~/.n8n` directory
- Removes container when stopped (`--rm` flag)

### Option B: Docker Compose (Recommended for production)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password_here
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - ~/.n8n:/home/node/.n8n
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

### Option C: With Persistent Database (PostgreSQL)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    container_name: n8n-postgres
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: your_db_password
    volumes:
      - n8n_postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=your_db_password
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password_here
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - ~/.n8n:/home/node/.n8n
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  n8n_postgres_data:
```

---

## Step 2: Access N8N

1. Open browser and go to: `http://localhost:5678`
2. Create your N8N account (first time only)
3. You should see the N8N dashboard

---

## Step 3: Create a Webhook in N8N

### 3.1 Create New Workflow

1. Click "New Workflow" in N8N
2. Name it "ALFRED Integration"

### 3.2 Add Webhook Node

1. Click the "+" button to add a node
2. Search for "Webhook"
3. Select "Webhook" node
4. Configure:
   - **HTTP Method**: POST
   - **Path**: `alfred` (or any custom path you prefer)
   - **Response Mode**: "Last Node"

### 3.3 Get Webhook URL

After adding the Webhook node, you'll see the URL:
```
Production URL: http://localhost:5678/webhook/alfred
Test URL: http://localhost:5678/webhook-test/alfred
```

**Important**: Use the **Production URL** in your `.env` file!

---

## Step 4: Configure ALFRED

### 4.1 Update `.env` File

Open your ALFRED `.env` file and update:

```env
# N8N Integration (Local Docker)
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/alfred
VITE_N8N_API_KEY=
```

**Note**: API key is optional for local development. For production, set up N8N authentication.

### 4.2 Restart ALFRED

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

---

## Step 5: Test the Integration

### 5.1 Create a Simple Test Workflow in N8N

1. Keep the Webhook node as the trigger
2. Add a "Set" node after webhook:
   - Click "+" after webhook node
   - Search for "Set"
   - Add a field: `message` = `Received from ALFRED`

3. Add a "Respond to Webhook" node:
   - Click "+" after Set node
   - Search for "Respond to Webhook"
   - Set response body: `{{ $json }}`

4. **Activate** the workflow (toggle switch in top-right)

### 5.2 Test from ALFRED

In your browser console (F12), run:

```javascript
await moduleManager.executeAction('automation', 'trigger_n8n_webhook', {
  event: 'test',
  message: 'Hello from ALFRED',
  timestamp: new Date().toISOString()
});
```

You should see the response in console and the workflow execute in N8N!

---

## Step 6: Example Workflows

### Example 1: Smart Home Light Control

**N8N Workflow:**
1. Webhook trigger (receives light state)
2. Switch node (checks if on/off)
3. HTTP Request to smart device API
4. Respond to webhook with status

**ALFRED Trigger:**
```javascript
await moduleManager.executeAction('automation', 'trigger_n8n_webhook', {
  action: 'control_light',
  deviceId: 'roku_bulb_1',
  state: 'on',
  brightness: 100
});
```

### Example 2: Daily Report Generation

**N8N Workflow:**
1. Webhook trigger
2. Function node (process data)
3. Gmail node (send email)
4. Respond to webhook

**ALFRED Trigger:**
```javascript
await moduleManager.executeAction('automation', 'trigger_n8n_webhook', {
  action: 'daily_report',
  expenses: totalExpenses,
  income: totalIncome,
  date: new Date().toISOString()
});
```

### Example 3: Goodnight Routine

**N8N Workflow:**
1. Webhook trigger
2. HTTP Request node × 3 (parallel):
   - Turn off lights
   - Lock door
   - Set thermostat
4. Respond to webhook

**ALFRED Trigger:**
```javascript
await moduleManager.executeAction('automation', 'run_workflow', {
  workflowId: 'goodnight_routine'
});
```

---

## Step 7: Advanced Configuration

### Enable N8N API Access

To use N8N API for creating workflows programmatically:

1. In N8N, go to Settings → API
2. Create an API key
3. Add to ALFRED `.env`:
   ```env
   VITE_N8N_API_KEY=your_api_key_here
   ```

### Secure N8N with Authentication

Add to your `docker-compose.yml`:
```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=true
  - N8N_BASIC_AUTH_USER=admin
  - N8N_BASIC_AUTH_PASSWORD=your_strong_password
```

### Use HTTPS (Production)

For production deployment, set up reverse proxy with SSL:

1. Install nginx
2. Configure reverse proxy to N8N
3. Set up Let's Encrypt SSL
4. Update webhook URL to `https://your-domain.com/webhook/alfred`

---

## Troubleshooting

### Issue: N8N webhook returns 404

**Solution:**
- Make sure workflow is **activated** (toggle in top-right)
- Verify you're using **Production URL**, not Test URL
- Check the webhook path matches your `.env` configuration

### Issue: CORS errors in browser

**Solution:**
N8N should handle CORS by default. If issues persist, add to N8N environment:
```yaml
environment:
  - N8N_CORS_ENABLE=true
```

### Issue: Cannot connect to localhost from Docker

**Solution:**
If N8N is in Docker and ALFRED is outside:
- Use `host.docker.internal` instead of `localhost` in N8N
- Or use Docker network: `docker network create n8n-network`

### Issue: Webhook timeout

**Solution:**
- Check N8N logs: `docker logs n8n`
- Ensure workflow completes within timeout period
- Use async patterns for long-running tasks

---

## N8N Best Practices

1. **Always activate workflows** before using them in production
2. **Use error handling nodes** to catch failures
3. **Test workflows** before connecting to ALFRED
4. **Use environment variables** in N8N for sensitive data
5. **Version control** your N8N workflows (export as JSON)
6. **Monitor execution logs** in N8N dashboard
7. **Set up backups** of your `~/.n8n` directory

---

## Next Steps

1. ✅ N8N running locally
2. ✅ Webhook configured
3. ✅ ALFRED connected
4. ⏭️ Create custom workflows for your needs
5. ⏭️ Build workflow designer in ALFRED (coming in next phase)

---

## Resources

- **N8N Documentation**: https://docs.n8n.io
- **N8N Community**: https://community.n8n.io
- **N8N Docker**: https://hub.docker.com/r/n8nio/n8n
- **Webhook Nodes**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

---

**Your N8N is now integrated with ALFRED!** 🎉

Start creating powerful automation workflows that connect your smart home, finances, and daily tasks.
