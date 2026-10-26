# PowerShell script to start PESUPool MySQL Server on port 3307
Write-Host "Starting PESUPool dedicated MySQL Server on port 3307..." -ForegroundColor Cyan

$dataDir = "C:\Users\deeks\.gemini\antigravity\scratch\pesupool\mysql_data"
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"

if (!(Test-Path $dataDir)) {
    Write-Host "Initializing MySQL data directory..." -ForegroundColor Yellow
    & $mysqld --initialize-insecure --datadir=$dataDir --console
}

Write-Host "Launching mysqld on port 3307..." -ForegroundColor Green
Start-Process -FilePath $mysqld -ArgumentList "--datadir=`"$dataDir`" --port=3307 --console" -WindowStyle Minimized
Start-Sleep -Seconds 3

Write-Host "MySQL Server 8.4 is ready on 127.0.0.1:3307 (User: root, Password: none)" -ForegroundColor Green
