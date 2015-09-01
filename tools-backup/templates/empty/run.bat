@echo off
if exist error.txt  del error.txt /f /q
echo 正在启动浏览器...[若发错误,日志将输出到error.txt内]
egret startserver -printError