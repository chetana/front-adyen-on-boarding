#!/bin/bash

# Development startup script for Adyen Onboarding
echo "🚀 Starting Adyen Onboarding Development Environment"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start both proxy server and frontend
echo "🔄 Starting proxy server and frontend..."
npm run dev:full