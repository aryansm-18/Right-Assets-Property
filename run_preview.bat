@echo off
echo ========================================================
echo   RIGHT ASSET'S PROPERTY - LUXURY REAL ESTATE PORTAL
echo   "Your Right Choice" - MCA Mini Project
echo   Founded by Sanjeev Mehta & Nutan Madam
echo ========================================================
echo.
echo Starting local web server on port 8000...
echo Opening browser to http://localhost:8000
echo.
start http://localhost:8000
python -m http.server 8000
pause
