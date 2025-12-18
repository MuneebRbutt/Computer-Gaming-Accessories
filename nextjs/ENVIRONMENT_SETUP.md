# Environment Variables Setup

Copy this file to `.env.local` in the `nextjs` directory and fill in your actual values.

```env
# Database
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
RESEND_DOMAIN="yourdomain.com"

# Payment Processing (Stripe)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxx"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Quick Setup Instructions

1. **Copy this file:**
   ```bash
   cp ENVIRONMENT_SETUP.md .env.local
   ```

2. **Get your API keys:**
   - **Resend**: Sign up at https://resend.com
   - **Stripe**: Sign up at https://stripe.com (use test keys for development)
   - **NextAuth Secret**: Generate with `openssl rand -base64 32`

3. **Fill in the values** in `.env.local`

4. **Never commit `.env.local`** to git (it's already in .gitignore)

