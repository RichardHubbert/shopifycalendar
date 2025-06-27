#!/bin/bash

# Shopify Calendar Deployment Script
# For theaidesign.co.uk/shopifycalendar

echo "🚀 Deploying Shopify Calendar to theaidesign.co.uk/shopifycalendar"

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build files are ready in the 'build' directory"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of the 'build' folder to your web server"
echo "2. Place them in the directory: /shopifycalendar/"
echo "3. Ensure your server is configured to serve static files"
echo ""
echo "🌐 Your calendar will be available at:"
echo "   https://theaidesign.co.uk/shopifycalendar"
echo ""
echo "🔧 Server Configuration Notes:"
echo "- Make sure your server serves index.html for all routes"
echo "- Configure proper MIME types for .js and .css files"
echo "- Set up HTTPS for secure Airtable API calls"
echo ""
echo "📝 Environment Variables (if needed on server):"
echo "- REACT_APP_AIRTABLE_BASE_ID=appf8Egc1TAE1hjUm"
echo "- REACT_APP_AIRTABLE_API_KEY=your_api_key"
echo "- REACT_APP_STORAGE_MODE=hybrid"
echo "- REACT_APP_AIRTABLE_TABLE_NAME=tblPn5rEFpQtpBL6y" 