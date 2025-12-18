# Complete Setup Guide


This guide will help you set up all the required environment variables and configure the website to be fully functional.

---

## Step 1: Environment Variables Setup

### 1.1 Create `.env.local` file

Create a `.env.local` file in the `nextjs` directory with the following variables:

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

### 1.2 Get Your API Keys

#### Resend (Email Service)
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to `RESEND_API_KEY`
6. Add your verified domain to `RESEND_DOMAIN`

#### Stripe (Payment Processing)
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account
3. Go to Developers > API Keys
4. Copy your **Secret key** (starts with `sk_test_` for test mode)
5. Copy your **Publishable key** (starts with `pk_test_` for test mode)
6. Add them to `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`

#### NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```
Or use an online generator: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

---

## Step 2: Configure Stripe Webhooks

### 2.1 Set up Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - **Development**: `http://localhost:3000/api/payment/webhook` (use Stripe CLI)
   - **Production**: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to `STRIPE_WEBHOOK_SECRET` in your `.env.local`

### 2.2 Test Webhooks Locally (Development)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (using Scoop)
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

Login to Stripe:
```bash
stripe login
```

Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

This will give you a webhook signing secret starting with `whsec_` - use this for `STRIPE_WEBHOOK_SECRET` in development.

---

## Step 3: Update Frontend to Use API Endpoints

The frontend has been updated with API client utilities. Here's how to use them:

### 3.1 Using Cart API

Instead of using `useCartStore` directly, use the synced version:

```typescript
// Old way (localStorage only)
import { useCartStore } from '@/hooks/useCartStore'

// New way (synced with backend)
import { useCartSync } from '@/lib/hooks/useCartSync'

function MyComponent() {
  const { items, addItem, removeItem, updateQuantity } = useCartSync()
  
  // addItem, removeItem, updateQuantity now sync with backend
}
```

### 3.2 Using Wishlist API

```typescript
import { useWishlistSync } from '@/lib/hooks/useWishlistSync'

function MyComponent() {
  const { items, addItem, removeItem, isInWishlist } = useWishlistSync()
  
  // All operations sync with backend
}
```

### 3.3 Direct API Calls

For other operations, use the API client:

```typescript
import { 
  ordersApi, 
  addressesApi, 
  reviewsApi, 
  checkoutApi,
  paymentApi 
} from '@/lib/api/client'

// Get orders
const orders = await ordersApi.get(1, 20)

// Create address
const address = await addressesApi.create({
  firstName: 'John',
  lastName: 'Doe',
  address1: '123 Main St',
  city: 'Karachi',
  state: 'Sindh',
  zipCode: '75500',
  country: 'Pakistan',
  isDefault: true
})

// Submit review
await reviewsApi.create({
  productId: 'product-id',
  rating: 5,
  title: 'Great product!',
  comment: 'Really happy with this purchase'
})

// Process checkout
const order = await checkoutApi.process({
  shippingAddressId: 'address-id',
  billingAddressId: 'address-id',
  paymentMethod: 'card',
  shippingAmount: 500,
  taxAmount: 0
})

// Create payment intent
const { clientSecret } = await paymentApi.createIntent(10000, 'pkr')
```

---

## Step 4: Test the APIs

### 4.1 Using Postman

#### Test Cart API

1. **Get Cart** (requires authentication)
   - Method: `GET`
   - URL: `http://localhost:3000/api/cart`
   - Headers: Include NextAuth session cookie

2. **Add to Cart**
   - Method: `POST`
   - URL: `http://localhost:3000/api/cart`
   - Body:
     ```json
     {
       "productId": "product-id-here",
       "quantity": 1
     }
     ```

3. **Update Cart Item**
   - Method: `PUT`
   - URL: `http://localhost:3000/api/cart/[item-id]`
   - Body:
     ```json
     {
       "quantity": 2
     }
     ```

4. **Remove from Cart**
   - Method: `DELETE`
   - URL: `http://localhost:3000/api/cart/[item-id]`

#### Test Checkout API

1. **Process Checkout**
   - Method: `POST`
   - URL: `http://localhost:3000/api/checkout`
   - Body:
     ```json
     {
       "shippingAddressId": "address-id",
       "billingAddressId": "address-id",
       "paymentMethod": "card",
       "shippingAmount": 500,
       "taxAmount": 0,
       "discountAmount": 0
     }
     ```

### 4.2 Using Frontend

1. Start the development server:
   ```bash
   cd nextjs
   npm run dev
   ```

2. Open `http://localhost:3000`

3. Login to your account

4. Test features:
   - Add products to cart
   - View cart
   - Add to wishlist
   - Create addresses
   - Submit reviews
   - Process checkout

---

## Step 5: Database Setup

Make sure your database is set up:

```bash
cd nextjs

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database (optional)
npm run db:seed
```

---

## Step 6: Verify Everything Works

### Checklist:

- [ ] Environment variables are set in `.env.local`
- [ ] Database is connected and schema is pushed
- [ ] Resend API key is configured
- [ ] Stripe keys are configured
- [ ] Stripe webhook is set up
- [ ] Frontend can add items to cart
- [ ] Cart persists after page refresh
- [ ] Wishlist works
- [ ] Checkout process works
- [ ] Orders are created successfully
- [ ] Email notifications are sent

---

## Troubleshooting

### Cart not syncing
- Check if user is logged in
- Check browser console for errors
- Verify API endpoints are accessible
- Check NextAuth session is valid

### Email not sending
- Verify `RESEND_API_KEY` is correct
- Check `RESEND_DOMAIN` is verified in Resend dashboard
- Check server logs for email errors

### Payment not working
- Verify Stripe keys are correct
- Check webhook is configured correctly
- Verify webhook secret matches
- Check Stripe dashboard for payment events

### API returns 401 Unauthorized
- User needs to be logged in
- Check NextAuth session is valid
- Verify cookies are being sent

---

## Production Deployment

### Environment Variables for Production

Update these in your hosting platform (Vercel, Netlify, etc.):

1. Set `NEXTAUTH_URL` to your production domain
2. Use production Stripe keys (not test keys)
3. Use production Resend domain
4. Generate a secure `NEXTAUTH_SECRET`

### Stripe Webhook for Production

1. Update webhook URL in Stripe dashboard to your production domain
2. Copy the new webhook secret
3. Update `STRIPE_WEBHOOK_SECRET` in production environment

---

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check server logs
3. Verify all environment variables are set
4. Ensure database is connected
5. Test API endpoints individually

---

## Next Steps

After setup is complete:
1. Test all features thoroughly
2. Set up monitoring for API errors
3. Configure email templates in Resend
4. Set up Stripe test mode for development
5. Prepare for production deployment

