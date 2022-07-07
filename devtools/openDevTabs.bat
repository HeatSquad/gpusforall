@echo off
:STARTTITLE
echo ========================
echo  Launching ConEmu Panes
echo ========================
echo ========================
echo  Launching GPUS4ALL
echo ========================
echo starting location: %~dp0
cd %~dp0\..
echo moved to: %cd%
TITLE MainConsole

:VARIABLES
SET currentPath=%cd%
SET /A splittab=1

:STARTCORESYS
git status -cur_console:n
set /A splittab+=1
cmd /k -new_console:t:"sys_webserver [DEV]":d:"%currentPath%\" npm run serve
set /A splittab+=1
cmd /k -new_console:s%splittab%T50H:t:"sys_webserverapis":d:"%currentPath%\sys_webserverapis\" node webserverapis.js
set /A splittab+=1
cmd /k -new_console:t:"dbu_scripts_gpusforall":d:"%currentPath%\..\dbu_scripts_gpusforall\" git status
@REM cmd /k -new_console:s2T50V
@REM cmd /k -new_console:s3T50V
@REM cmd /k -new_console