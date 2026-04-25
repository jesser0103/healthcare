param(
  [string]$Url = "http://localhost:8080/health"
)

Write-Host "Watching $Url (Ctrl+C to stop)"

while ($true) {
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing
    $active = $resp.Headers["X-Active-Region"]
    $body = $resp.Content
    $ts = (Get-Date).ToString("o")
    Write-Host "$ts active=$active body=$body"
  } catch {
    $ts = (Get-Date).ToString("o")
    Write-Host "$ts request_failed=$($_.Exception.Message)"
  }
  Start-Sleep -Seconds 2
}
