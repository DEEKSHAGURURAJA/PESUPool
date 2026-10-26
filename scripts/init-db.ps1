# PowerShell script to re-execute schema DDL and seed DML
Write-Host "Resetting and Seeding PESUPool Database..." -ForegroundColor Cyan

$mysql = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$sqlDir = "C:\Users\deeks\.gemini\antigravity\scratch\pesupool\sql"

Write-Host "Executing 01_schema.sql..." -ForegroundColor Yellow
& $mysql -h 127.0.0.1 -P 3307 -u root -e "source $sqlDir/01_schema.sql;"

Write-Host "Executing 02_seed.sql..." -ForegroundColor Yellow
& $mysql -h 127.0.0.1 -P 3307 -u root -e "source $sqlDir/02_seed.sql;"

Write-Host "PESUPool Database reseeded successfully!" -ForegroundColor Green
