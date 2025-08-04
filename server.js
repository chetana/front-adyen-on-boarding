import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Vite dev server ports
  credentials: true
}));

app.use(express.json());

// Serve static files from dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Adyen API proxy routes
const ADYEN_BASE_URLS = {
  test: {
    lem: 'https://kyc-test.adyen.com/lem/v3',
    bcl: 'https://balanceplatform-api-test.adyen.com/bcl/v2',
    management: 'https://management-test.adyen.com/v3'
  },
  live: {
    lem: 'https://kyc-live.adyen.com/lem/v3',
    bcl: 'https://balanceplatform-api-live.adyen.com/bcl/v2',
    management: 'https://management-live.adyen.com/v3'
  }
};

// Generic proxy handler
const createProxyHandler = (getBaseUrl) => {
  return async (req, res) => {
    try {
      const { environment = 'test' } = req.query;
      const baseUrl = getBaseUrl(environment);
      // Extract the path after /api/adyen/{service}/
      const pathParts = req.path.split('/');
      const serviceIndex = pathParts.indexOf('adyen') + 1;
      const serviceName = pathParts[serviceIndex]; // lem, bcl, or management
      const apiPath = '/' + pathParts.slice(serviceIndex + 1).join('/');
      const targetUrl = `${baseUrl}${apiPath}`;
      
      console.log(`Proxying ${req.method} request to: ${targetUrl}`);
      
      // Extract API key from headers
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) {
        return res.status(400).json({ error: 'X-API-Key header is required' });
      }

      // Prepare headers for Adyen API
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      };

      // Make request to Adyen API
      const response = await axios({
        method: req.method,
        url: targetUrl,
        data: req.body,
        headers,
        timeout: 30000
      });

      // Return Adyen's response
      res.status(response.status).json(response.data);
      
    } catch (error) {
      console.error('Proxy error:', error.message);
      
      if (error.response) {
        // Adyen API returned an error
        const status = error.response.status;
        const data = error.response.data;
        console.error(`Adyen API error ${status}:`, data);
        res.status(status).json(data);
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.message);
        res.status(503).json({ 
          error: 'Service unavailable', 
          message: 'Unable to reach Adyen API' 
        });
      } else {
        // Other error
        console.error('Unexpected error:', error.message);
        res.status(500).json({ 
          error: 'Internal server error', 
          message: error.message 
        });
      }
    }
  };
};

// LEM API proxy (Legal Entity Management)
app.all('/api/adyen/lem/*', createProxyHandler((env) => ADYEN_BASE_URLS[env]?.lem || ADYEN_BASE_URLS.test.lem));

// BCL API proxy (Balance Platform)
app.all('/api/adyen/bcl/*', createProxyHandler((env) => ADYEN_BASE_URLS[env]?.bcl || ADYEN_BASE_URLS.test.bcl));

// Management API proxy
app.all('/api/adyen/management/*', createProxyHandler((env) => ADYEN_BASE_URLS[env]?.management || ADYEN_BASE_URLS.test.management));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Adyen Onboarding Proxy Server running on port ${PORT}`);
  console.log(`📡 Proxying requests to Adyen APIs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}/api/adyen`);
  }
});