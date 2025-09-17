@echo off
echo Starting ClauseCraft Frontend...

REM Check if node_modules exists, if not, install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting development server on http://localhost:5173
echo Demo Login Credentials:
echo   Admin: demo@clausecraft.com / demo123
echo   Lawyer: lawyer@clausecraft.com / lawyer123
echo   Client: client@clausecraft.com / client123
echo.

npm run dev