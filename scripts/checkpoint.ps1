<#
.SYNOPSIS
  Git checkpoint and rollback utility for Spidport development.
.EXAMPLE
  .\scripts\checkpoint.ps1 save "Before redesigning hero"
  .\scripts\checkpoint.ps1 list
  .\scripts\checkpoint.ps1 restore
#>
param(
  [Parameter(Position=0)]
  [string]$Action = "save",
  
  [Parameter(Position=1)]
  [string]$Message = "Auto-checkpoint"
)

switch ($Action.ToLower()) {
  "save" {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $stashMsg = "checkpoint: $timestamp - $Message"
    git stash push -u -m "$stashMsg"
    git stash apply --index
    Write-Host "✔ Checkpoint created: $stashMsg" -ForegroundColor Green
  }
  "list" {
    Write-Host "--- Git Checkpoints ---" -ForegroundColor Cyan
    git stash list | Select-String "checkpoint:"
  }
  "restore" {
    Write-Host "⚠ Restoring most recent checkpoint..." -ForegroundColor Yellow
    git checkout -- .
    git clean -fd
    Write-Host "✔ Restored cleanly to checkpoint." -ForegroundColor Green
  }
  default {
    Write-Host "Usage: .\checkpoint.ps1 [save <msg> | list | restore]" -ForegroundColor Red
  }
}
