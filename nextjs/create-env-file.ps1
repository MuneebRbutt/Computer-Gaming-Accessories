# PowerShell script to create .env.local file
# Run this script: .\create-env-file.ps1

$envContent = @"
# Database Connection
# Replace with your MongoDB connection string
# For MongoDB Atlas: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/computer-gaming-accessories?retryWrites=true&w=majority
# For Local MongoDB: mongodb://localhost:27017/computer-gaming-accessories
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"

# NextAuth Configuration
# Generate a secret key: openssl rand -base64 32
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email Service (Resend) - Optional for now
RESEND_API_KEY=""
RESEND_DOMAIN=""

# Payment Processing (Stripe) - Optional for now
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@

# Create .env.local file
$envContent | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Update DATABASE_URL with your actual MongoDB connection string!" -ForegroundColor Yellow
Write-Host "   See HOW_TO_GET_DATABASE_URL.md for instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open .env.local file"
Write-Host "   2. Replace DATABASE_URL with your MongoDB connection string"
Write-Host "   3. Generate NEXTAUTH_SECRET: openssl rand -base64 32"
Write-Host "   4. Run: npm run db:push"

