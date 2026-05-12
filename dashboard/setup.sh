#!/bin/bash

# Trading Dashboard Setup Script
# Run this script to set up the dashboard environment

echo "🚀 Setting up Trading Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo "✅ NPM detected: $(npm --version)"

# Navigate to dashboard directory
cd "$(dirname "$0")" || exit 1

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:3000/dashboard"
echo ""
echo "3. Enter a stock symbol (e.g., TCS, INFY) and click 'Run Analysis'"
echo ""
echo "📚 For more information, see AI_DASHBOARD_README.md"
echo ""
