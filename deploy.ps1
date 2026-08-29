# ─── Autonomous OS — One-Click Deploy Script ────────────────────────
# Deploys Flask to AWS Lambda (Free Tier) and builds React

param (
    [string]$AwsRegion = "ap-south-1",
    [string]$AccountId = ""
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AUTONOMOUS OS — AWS DEPLOYMENT (FREE TIER)         " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Check AWS CLI
Write-Host "`n[1/4] Checking AWS credentials..." -ForegroundColor Yellow
$identity = aws sts get-caller-identity 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "AWS credentials not detected. Please run 'aws configure' with your IAM Access Key." -ForegroundColor Red
    exit 1
}
Write-Host "✓ AWS Account verified: $identity" -ForegroundColor Green

# 2. Build React frontend
Write-Host "`n[2/4] Building React Frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built successfully into frontend/dist" -ForegroundColor Green

# 3. Deploy CDK Infrastructure
Write-Host "`n[3/4] Deploying AWS CDK Stack (Lambda + API Gateway + Amplify)..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\infra"
pip install -r requirements.txt --quiet

if ($AccountId -eq "") {
    $AccountId = (aws sts get-caller-identity --query "Account" --output text).Trim()
}

cdk bootstrap "aws://$AccountId/$AwsRegion"
cdk deploy AutonomousOsStack --require-approval never --outputs-file cdk-outputs.json -c account=$AccountId -c region=$AwsRegion

# 4. Output Summary
Write-Host "`n[4/4] Deployment Complete!" -ForegroundColor Green
Get-Content cdk-outputs.json | ConvertFrom-Json | Format-List
