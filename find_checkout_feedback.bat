@echo off
echo ================================================
echo 🔍 Scanning for checkout / thank / feedback files...
echo ================================================

cd /d %~dp0

REM Create results file
set OUTPUT=checkout_feedback_scan.txt

echo Project structure scan - %date% %time% > %OUTPUT%
echo ================================================ >> %OUTPUT%
echo. >> %OUTPUT%

REM Search inside src folder for keywords
findstr /S /I /C:"checkout" /C:"thank" /C:"feedback" src\*.* >> %OUTPUT%

echo. >> %OUTPUT%
echo ✅ Done! Results saved to %OUTPUT%
echo --------------------------------
pause
