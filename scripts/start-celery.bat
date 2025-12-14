@echo off
REM Celery Worker and Beat startup script for Windows

echo Starting Celery Worker...
start "Celery Worker" cmd /k "cd /d c:\eldonia-nex\backend && celery -A eldinia_nex worker --loglevel=info --pool=solo"

timeout /t 3

echo Starting Celery Beat...
start "Celery Beat" cmd /k "cd /d c:\eldonia-nex\backend && celery -A eldinia_nex beat --loglevel=info"

echo.
echo Celery Worker and Beat started successfully!
echo Press any key to exit...
pause
