@echo off
setlocal
set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set TARGET=%DIRNAME%app-services\user\gradlew.bat
if exist "%TARGET%" (
  call "%TARGET%" %*
) else (
  echo ERROR: Could not find delegated Gradle wrapper at %TARGET%
  exit /b 1
)
endlocal
