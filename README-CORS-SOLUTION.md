# CORS Solution for Adyen Onboarding

## Problem
The frontend application was experiencing CORS errors when trying to make direct API calls to Adyen's endpoints from the browser:

```
Access to XMLHttpRequest at 'https://kyc-test.adyen.com/lem/v3/legalEntities' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solution
Created a Node.js/Express proxy server that acts as an intermediary between the frontend and Adyen's APIs.

### Architecture
```
Frontend (Vue.js) → Proxy Server (Express.js) → Adyen APIs
http://localhost:3000 → http://localhost:3001 → https://kyc-test.adyen.com
```

## Files Modified/Created

### 1. `server.js` (NEW)
- Express.js proxy server
- Handles CORS headers
- Routes requests to appropriate Adyen APIs
- Manages API keys and environment switching

### 2. `package.json` (MODIFIED)
- Added Express.js and CORS dependencies
- Added new scripts for running the proxy server
- Added development dependencies (nodemon, concurrently)

### 3. `src/services/AdyenApiService.js` (MODIFIED)
- Updated to use proxy URLs instead of direct Adyen URLs
- Simplified axios configuration
- Added environment parameter handling

### 4. `.env.development` (NEW)
- Development environment configuration
- Proxy server URL configuration

### 5. `dev-start.sh` (NEW)
- Convenient script to start both proxy and frontend

## How to Use

### Development Mode

#### Option 1: Start both services together
```bash
npm run dev:full
```
This starts both the proxy server (port 3001) and the frontend (port 3000/5173).

#### Option 2: Start services separately
```bash
# Terminal 1: Start proxy server
npm run server:dev

# Terminal 2: Start frontend
npm run dev
```

#### Option 3: Use the convenience script
```bash
./dev-start.sh
```

### Production Mode
```bash
npm run build
npm start
```
This builds the frontend and serves it through the proxy server.

## API Endpoints

The proxy server exposes these endpoints:

- **LEM API**: `http://localhost:3001/api/adyen/lem/*`
- **BCL API**: `http://localhost:3001/api/adyen/bcl/*`
- **Management API**: `http://localhost:3001/api/adyen/management/*`
- **Health Check**: `http://localhost:3001/api/health`

## Environment Configuration

### Development
- Frontend: `http://localhost:3000` or `http://localhost:5173`
- Proxy: `http://localhost:3001`
- Environment: `test` (default)

### Production
- Single server serves both frontend and API proxy
- Environment: configurable via environment variables

## Request Flow

1. **Frontend** makes request to proxy: `POST http://localhost:3001/api/adyen/lem/legalEntities`
2. **Proxy** receives request with:
   - `X-API-Key` header (from frontend)
   - `environment` query parameter (test/live)
3. **Proxy** forwards to Adyen: `POST https://kyc-test.adyen.com/lem/v3/legalEntities`
4. **Adyen** responds to proxy
5. **Proxy** returns response to frontend

## Benefits

✅ **Eliminates CORS issues**: Browser security policies don't apply to server-to-server requests
✅ **API key security**: Keys are handled server-side
✅ **Environment switching**: Easy test/live environment switching
✅ **Error handling**: Centralized error handling and logging
✅ **Development friendly**: Hot reload for both frontend and backend
✅ **Production ready**: Single deployment artifact

## Troubleshooting

### Port conflicts
If port 3001 is in use, set a different port:
```bash
PORT=3002 npm run server
```

### API key issues
Ensure your API keys are properly configured in your frontend configuration.

### Network issues
Check the proxy server logs for detailed error information:
```bash
npm run server:dev
```

### CORS still appearing
Make sure you're using the proxy URLs (`http://localhost:3001/api/adyen/...`) and not the direct Adyen URLs.

## Testing

Test the proxy server directly:
```bash
curl -X GET "http://localhost:3001/api/health"
```

Test with Adyen API:
```bash
curl -X POST "http://localhost:3001/api/adyen/lem/legalEntities" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"type":"organization","organization":{"legalName":"Test"}}'
```