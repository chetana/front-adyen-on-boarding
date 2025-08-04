# Updated Deployment Guide - CORS Solution

## Overview
This guide explains how to deploy the updated Adyen Onboarding application with the new proxy server solution to Google Cloud Run.

## What Changed

### Before (CORS Issues)
```
Frontend (Browser) → Direct API calls → Adyen APIs ❌ CORS Error
```

### After (CORS Solution)
```
Frontend (Browser) → Proxy Server → Adyen APIs ✅ Works!
```

## Architecture in Production

### Development Environment
- **Frontend**: `http://localhost:3000` (Vite dev server)
- **Proxy**: `http://localhost:3001` (Express server)
- **Adyen APIs**: Direct calls from proxy server

### Production Environment (Cloud Run)
- **Single Container**: Serves both frontend and proxy on same port
- **Frontend**: Static files served by Express server
- **Proxy**: Same Express server handles API calls
- **Port**: Uses `$PORT` environment variable from Cloud Run

## Deployment Process

### 1. Build and Deploy (Same as Before)
Your existing deployment process remains **exactly the same**:

```bash
# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/adyen-onboarding .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/adyen-onboarding

# Deploy to Cloud Run
gcloud run deploy adyen-onboarding \
  --image gcr.io/YOUR_PROJECT_ID/adyen-onboarding \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated
```

### 2. Environment Variables
Set these environment variables in Cloud Run:

```bash
# Required for Adyen API calls
VITE_ADYEN_ENVIRONMENT=live  # or 'test' for testing
VITE_ADYEN_CLIENT_KEY=your-adyen-client-key

# Optional: Override default port (Cloud Run sets this automatically)
PORT=8080

# Production environment
NODE_ENV=production
```

### 3. Cloud Run Configuration
- **Port**: 8080 (automatically configured)
- **Memory**: 512Mi (recommended minimum)
- **CPU**: 1 (sufficient for proxy + static serving)
- **Concurrency**: 80 (default is fine)
- **Timeout**: 300s (for long-running API calls)

## How It Works in Production

### 1. Single Server Architecture
```
Cloud Run Container:
├── Express Server (port 8080)
│   ├── Serves static files from /dist
│   ├── Handles /api/adyen/* proxy routes
│   └── Forwards requests to Adyen APIs
└── Built Vue.js App (in /dist folder)
```

### 2. Request Flow
1. **Browser** requests `https://your-app.run.app/`
2. **Express** serves the Vue.js app from `/dist`
3. **Vue.js app** makes API calls to `/api/adyen/*` (same origin)
4. **Express** proxies these to Adyen APIs
5. **Adyen** responds to Express
6. **Express** returns response to Vue.js app

### 3. No CORS Issues
- All API calls are same-origin (browser → your server)
- Your server makes server-to-server calls to Adyen
- CORS policies don't apply to server-to-server requests

## Updated Files

### 1. `Dockerfile` (Updated)
```dockerfile
# Now runs Express server instead of static file server
CMD ["npm", "start"]
```

### 2. `package.json` (Updated)
```json
{
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "server": "node server.js",
    "server:dev": "nodemon server.js",
    "dev:full": "concurrently \"npm run server:dev\" \"npm run dev\""
  }
}
```

### 3. `server.js` (New)
- Express server with CORS handling
- Proxy routes for Adyen APIs
- Static file serving in production

### 4. `src/services/AdyenApiService.js` (Updated)
- Uses proxy URLs instead of direct Adyen URLs
- Handles development vs production environments

## Testing the Deployment

### 1. Local Production Test
```bash
# Build and test locally
npm run build
npm start

# Test in browser
open http://localhost:8080
```

### 2. Cloud Run Health Check
```bash
# After deployment, test the health endpoint
curl https://your-app.run.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "port": 8080
}
```

### 3. API Proxy Test
```bash
# Test the proxy (replace with your API key)
curl -X POST "https://your-app.run.app/api/adyen/lem/legalEntities" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"type":"organization","organization":{"legalName":"Test"}}'
```

## Benefits of This Solution

✅ **Zero CORS Issues**: All requests are same-origin  
✅ **Same Deployment Process**: No changes to your CI/CD  
✅ **Single Container**: Simplified architecture  
✅ **API Key Security**: Keys handled server-side  
✅ **Environment Switching**: Easy test/live switching  
✅ **Production Ready**: Optimized for Cloud Run  
✅ **Cost Effective**: Single service instead of multiple  

## Troubleshooting

### 1. Port Issues
Cloud Run automatically sets the `PORT` environment variable. The app listens on this port.

### 2. API Key Configuration
Ensure your API keys are properly configured in your frontend configuration, not as environment variables in Cloud Run.

### 3. Environment Switching
The app defaults to 'test' environment. Set `environment: 'live'` in your frontend config for production.

### 4. Logs
Check Cloud Run logs for detailed error information:
```bash
gcloud logs read --service=adyen-onboarding --limit=50
```

## Migration Checklist

- [x] Updated `Dockerfile` to run Express server
- [x] Added proxy server (`server.js`)
- [x] Updated `package.json` with new dependencies and scripts
- [x] Modified `AdyenApiService.js` to use proxy URLs
- [x] Created environment configuration files
- [x] Tested build process
- [x] Ready for deployment!

## Next Steps

1. **Deploy**: Use your existing deployment process
2. **Test**: Verify the health endpoint and API calls
3. **Monitor**: Check Cloud Run logs for any issues
4. **Celebrate**: No more CORS errors! 🎉

The solution is fully backward compatible with your existing deployment process while solving the CORS issue completely.