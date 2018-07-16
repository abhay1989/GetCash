@echo off
pm2 stop 0
pause
pm2 flush
pause
pm2 start 0
pause
cls
pm2 logs

