#!/bin/bash
echo "Starting ClauseCraft Frontend..."

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server on http://localhost:5173"
echo "Demo Login Credentials:"
echo "  Admin: demo@clausecraft.com / demo123"
echo "  Lawyer: lawyer@clausecraft.com / lawyer123"  
echo "  Client: client@clausecraft.com / client123"
echo ""

npm run dev