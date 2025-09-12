# Disable git pager
$env:GIT_PAGER = "cat"
git config --global core.pager "cat"

# Add all changes
git add .

# Commit changes
git commit -m "Fix API key handling and provider isolation"

# Push to remote
git push origin main

Write-Host "Code pushed successfully!" -ForegroundColor Green
