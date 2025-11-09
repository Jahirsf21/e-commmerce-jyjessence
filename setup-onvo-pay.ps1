# Script de Configuración de Onvo Pay
# Este script copia los archivos .env.example a .env y prepara el entorno

Write-Host "🚀 Configurando Onvo Pay para JyJ Essence..." -ForegroundColor Cyan
Write-Host ""

# Función para copiar archivo .env si no existe
function Copy-EnvFile {
    param (
        [string]$Source,
        [string]$Destination
    )
    
    if (Test-Path $Destination) {
        Write-Host "⚠️  $Destination ya existe. Saltando..." -ForegroundColor Yellow
    } else {
        Copy-Item $Source $Destination
        Write-Host "✅ Creado $Destination" -ForegroundColor Green
    }
}

# Directorio raíz del proyecto
$RootDir = Split-Path -Parent $PSScriptRoot

Write-Host "📁 Copiando archivos de configuración..." -ForegroundColor Cyan

# Backend - service-pagos
Copy-EnvFile `
    -Source "$RootDir\backend\service-pagos\.env.example" `
    -Destination "$RootDir\backend\service-pagos\.env"

# Backend - service-pedido
Copy-EnvFile `
    -Source "$RootDir\backend\service-pedido\.env.example" `
    -Destination "$RootDir\backend\service-pedido\.env"

# Frontend
Copy-EnvFile `
    -Source "$RootDir\frontend\.env.example" `
    -Destination "$RootDir\frontend\.env"

Write-Host ""
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan

# Instalar dependencias en service-pagos
Write-Host "   - service-pagos..." -ForegroundColor Gray
Set-Location "$RootDir\backend\service-pagos"
pnpm install --silent

# Instalar axios en service-pedido
Write-Host "   - service-pedido..." -ForegroundColor Gray
Set-Location "$RootDir\backend\service-pedido"
pnpm add axios --silent

Write-Host ""
Write-Host "🗄️  Ejecutando migraciones de Prisma..." -ForegroundColor Cyan
Set-Location "$RootDir\backend\database"

# Ejecutar migración
npx prisma migrate dev --name add_payment_fields

Write-Host ""
Write-Host "✨ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Edita los archivos .env con tus llaves de Onvo Pay" -ForegroundColor White
Write-Host "   2. Inicia los servicios:" -ForegroundColor White
Write-Host "      - cd backend\service-pagos && pnpm start" -ForegroundColor Gray
Write-Host "      - cd backend\service-pedido && pnpm start" -ForegroundColor Gray
Write-Host "      - cd frontend && pnpm dev" -ForegroundColor Gray
Write-Host "   3. Configura el webhook en Onvo Pay Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📖 Lee ONVO_PAY_INTEGRATION.md para más información" -ForegroundColor Cyan

# Volver al directorio raíz
Set-Location $RootDir
