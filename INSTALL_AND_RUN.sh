#!/bin/bash

echo "🔧 Fixing npm dependencies..."

# Clean cache
echo "Cleaning npm cache..."
npm cache clean --force

# Remove node_modules and lock file
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Reinstall dependencies
echo "Installing dependencies..."
npm install

# Check if concurrently is installed
echo "Verifying concurrently installation..."
npm list concurrently

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting the app..."
echo ""
npm run dev:all
