# Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks for payment processing.

---

## Step 1: Install Stripe CLI (for Local Development)

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Windows (using Scoop)
```bash
scoop install stripe
```

### Or Download
Visit: https://stripe.com/docs/stripe-cli

---

## Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with Stripe.

---

## Step 3: Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

This command will:
- Start listening for Stripe events
- Forward them to your local server
- Display a webhook signing secret (starts with `whsec_`)

**Copy the webhook signing secret** and add it to your `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## Step 4: Test Webhook (Optional)

In another terminal, trigger a test event:
```bash
stripe trigger payment_intent.succeeded
```

You should see the event in your first terminal and your server should receive it.

---

## Step 5: Production Setup

### 5.1 Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter your production webhook URL:
   ```
   https://yourdomain.com/api/payment/webhook
   ```
4. Select events to listen to:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
5. Click **"Add endpoint"**

### 5.2 Get Webhook Signing Secret

1. Click on your webhook endpoint
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to your production environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

### 5.3 Test Production Webhook

1. In Stripe Dashboard, go to your webhook endpoint
2. Click **"Send test webhook"**
3. Select an event type (e.g., `payment_intent.succeeded`)
4. Click **"Send test webhook"**
5. Check your server logs to verify it was received

---

## Webhook Events Handled

Your webhook handler processes these events:

### `payment_intent.succeeded`
- Updates order payment status to `PAID`
- Updates order status to `CONFIRMED`

### `payment_intent.payment_failed`
- Updates order payment status to `FAILED`

### `charge.refunded`
- Restores inventory for refunded items
- Updates order payment status to `REFUNDED`
- Updates order status to `REFUNDED`

---

## Troubleshooting

### Webhook not receiving events

1. **Check webhook URL is correct**
   - Development: `http://localhost:3000/api/payment/webhook`
   - Production: `https://yourdomain.com/api/payment/webhook`

2. **Verify webhook secret matches**
   - Development: Secret from `stripe listen` command
   - Production: Secret from Stripe Dashboard

3. **Check server logs** for errors

4. **Verify endpoint is accessible**
   - Test with: `curl https://yourdomain.com/api/payment/webhook`

### Webhook signature verification fails

- Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
- Ensure you're using the correct secret for your environment
- Check that the webhook secret hasn't been rotated

### Events not being processed

- Check server logs for errors
- Verify event types are selected in Stripe Dashboard
- Ensure your webhook handler code is deployed

---

## Security Notes

- ✅ Webhook signature is verified automatically
- ✅ Only process events from Stripe
- ✅ Use HTTPS in production
- ✅ Keep webhook secret secure (never commit to git)
- ✅ Rotate webhook secret if compromised

---

## Next Steps

After setting up webhooks:

1. Test payment flow end-to-end
2. Monitor webhook delivery in Stripe Dashboard
3. Set up alerts for failed webhook deliveries
4. Test refund scenarios
5. Monitor order status updates

---

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

