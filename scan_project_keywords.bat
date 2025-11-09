@echo off
echo =====================================================
echo 🔍 Scanning project for checkout / feedback / booking / order keywords...
echo =====================================================

cd /d %~dp0

set OUTPUT=project_keyword_scan.txt

echo Project Keyword Scan - %date% %time% > %OUTPUT%
echo ===================================================== >> %OUTPUT%
echo. >> %OUTPUT%

REM === Search for keywords in all source files ===
findstr /S /I /C:"checkout" /C:"thank" /C:"feedback" /C:"booking" /C:"order" src\*.* >> %OUTPUT%

echo. >> %OUTPUT%
echo ===================================================== >> %OUTPUT%
echo ✅ Scan Complete! Results saved to %OUTPUT%
echo =====================================================
pause
