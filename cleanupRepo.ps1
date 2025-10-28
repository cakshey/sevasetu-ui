# =========================================================
# 🧹 SevaSetu Auto Cleanup + Git Push Script
# =========================================================
# This script safely cleans junk files, commits, and pushes
# the latest version to GitHub and triggers a Vercel deploy.
# =========================================================

Write-Host "`n🚀 Starting SevaSetu Auto Cleanup & Push..." -ForegroundColor Cyan

# Step 1: Clean cached junk from Git
git rm -r --cached node_modules 2>$null
git rm -r --cached functions/node_modules 2>$null
git rm -r --cached admin-scripts/node_modules 2>$null
git rm -r --cached backups 2>$null
git rm --cached serviceAccountKey.json 2>$null
git rm --cached *.xlsx 2>$null
git rm --cached *.xls 2>$null
git rm --cached *.json.bak 2>$null

# Step 2: Ensure .gitignore is included
git add .gitignore

# Step 3: Add everything cleanly
git add .

# Step 4: Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "chore(auto): repo cleanup & push at $timestamp"

# Step 5: Push to GitHub
git push origin main --force

Write-Host "`n✅ Cleanup + Push Completed Successfully!" -ForegroundColor Green
Write-Host "🌐 GitHub Repo: https://github.com/cakshey/sevasetu-ui"
Write-Host "🌍 Vercel Deploy: https://sevasetu-ui.vercel.app`n"
Write-Host "✨ Done! Your repo & Vercel are now synced and clean." -ForegroundColor Yellow
