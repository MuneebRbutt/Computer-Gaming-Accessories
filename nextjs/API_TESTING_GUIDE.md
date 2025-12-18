# API Testing Guide

This guide provides examples for testing all API endpoints using Postman, curl, or the frontend.

---

## Prerequisites

1. **Start the development server:**
   ```bash
   cd nextjs
   npm run dev
   ```

2. **Login via frontend** to get a session cookie, or use NextAuth API directly

---

## Authentication

Most endpoints require authentication via NextAuth. You'll need a valid session cookie.

### Getting Session Cookie

1. Login via frontend at `http://localhost:3000/login`
2. Open browser DevTools > Application > Cookies
3. Copy the `next-auth.session-token` cookie value
4. Use it in your API requests

---

## API Endpoints

### Cart API

#### Get Cart
```bash
GET http://localhost:3000/api/cart
```

#### Add to Cart
```bash
POST http://localhost:3000/api/cart
Content-Type: application/json

{
  "productId": "product-id-here",
  "quantity": 1
}
```

#### Update Cart Item
```bash
PUT http://localhost:3000/api/cart/[item-id]
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove from Cart
```bash
DELETE http://localhost:3000/api/cart/[item-id]
```

#### Clear Cart
```bash
DELETE http://localhost:3000/api/cart
```

---

### Wishlist API

#### Get Wishlist
```bash
GET http://localhost:3000/api/wishlist
```

#### Add to Wishlist
```bash
POST http://localhost:3000/api/wishlist
Content-Type: application/json

{
  "productId": "product-id-here"
}
```

#### Remove from Wishlist
```bash
DELETE http://localhost:3000/api/wishlist/[product-id]
```

---

### Orders API

#### Get User Orders
```bash
GET http://localhost:3000/api/orders?page=1&limit=20&status=PENDING
```

#### Get Order Details
```bash
GET http://localhost:3000/api/orders/[order-id]
```

---

### Addresses API

#### Get Addresses
```bash
GET http://localhost:3000/api/addresses
```

#### Create Address
```bash
POST http://localhost:3000/api/addresses
Content-Type: application/json

{
  "type": "SHIPPING",
  "firstName": "John",
  "lastName": "Doe",
  "address1": "123 Main Street",
  "address2": "Apt 4B",
  "city": "Karachi",
  "state": "Sindh",
  "zipCode": "75500",
  "country": "Pakistan",
  "phone": "+923001234567",
  "isDefault": true
}
```

#### Update Address
```bash
PUT http://localhost:3000/api/addresses/[address-id]
Content-Type: application/json

{
  "city": "Lahore",
  "state": "Punjab"
}
```

#### Delete Address
```bash
DELETE http://localhost:3000/api/addresses/[address-id]
```

#### Set Default Address
```bash
PUT http://localhost:3000/api/addresses/[address-id]/set-default
```

---

### Checkout API

#### Process Checkout
```bash
POST http://localhost:3000/api/checkout
Content-Type: application/json

{
  "shippingAddressId": "address-id",
  "billingAddressId": "address-id",
  "paymentMethod": "card",
  "shippingMethod": "standard",
  "shippingAmount": 500,
  "taxAmount": 0,
  "discountAmount": 0,
  "notes": "Please deliver before 5 PM"
}
```

---

### Payment API

#### Create Payment Intent
```bash
POST http://localhost:3000/api/payment/create-intent
Content-Type: application/json

{
  "amount": 10000,
  "currency": "pkr"
}
```

Response:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

### Reviews API

#### Get Product Reviews
```bash
GET http://localhost:3000/api/reviews?productId=product-id-here
```

#### Submit Review
```bash
POST http://localhost:3000/api/reviews
Content-Type: application/json

{
  "productId": "product-id-here",
  "rating": 5,
  "title": "Great product!",
  "comment": "Really happy with this purchase. Works perfectly!",
  "pros": ["Fast shipping", "Good quality"],
  "cons": ["A bit expensive"]
}
```

#### Mark Review as Helpful
```bash
PUT http://localhost:3000/api/reviews/[review-id]/helpful
```

---

### Support Tickets API

#### Get Tickets
```bash
GET http://localhost:3000/api/support
```

#### Create Ticket
```bash
POST http://localhost:3000/api/support
Content-Type: application/json

{
  "subject": "Order not received",
  "message": "I placed an order 5 days ago but haven't received it yet.",
  "priority": "HIGH"
}
```

#### Get Ticket Details
```bash
GET http://localhost:3000/api/support/[ticket-id]
```

#### Update Ticket
```bash
PUT http://localhost:3000/api/support/[ticket-id]
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

#### Delete Ticket
```bash
DELETE http://localhost:3000/api/support/[ticket-id]
```

---

### PC Builder API

#### Get Builds
```bash
GET http://localhost:3000/api/pc-builder
```

#### Create Build
```bash
POST http://localhost:3000/api/pc-builder
Content-Type: application/json

{
  "name": "Gaming PC Build",
  "description": "High-end gaming setup",
  "public": false
}
```

#### Get Build Details
```bash
GET http://localhost:3000/api/pc-builder/[build-id]
```

#### Update Build
```bash
PUT http://localhost:3000/api/pc-builder/[build-id]
Content-Type: application/json

{
  "name": "Updated Build Name",
  "public": true
}
```

#### Delete Build
```bash
DELETE http://localhost:3000/api/pc-builder/[build-id]
```

#### Add Component to Build
```bash
POST http://localhost:3000/api/pc-builder/[build-id]/items
Content-Type: application/json

{
  "productId": "product-id",
  "category": "cpu",
  "quantity": 1
}
```

#### Remove Component from Build
```bash
DELETE http://localhost:3000/api/pc-builder/[build-id]/items/[item-id]
```

---

### Newsletter API

#### Subscribe
```bash
POST http://localhost:3000/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Unsubscribe
```bash
POST http://localhost:3000/api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## Testing with Postman

### Setting up Postman

1. **Create a new Collection** called "Computer Gaming API"

2. **Set up Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `session_token`: (your NextAuth session token)

3. **Add Pre-request Script** to collection:
   ```javascript
   // Auto-include session cookie
   pm.request.headers.add({
     key: 'Cookie',
     value: `next-auth.session-token=${pm.environment.get('session_token')}`
   })
   ```

4. **Create requests** for each endpoint above

---

## Testing with curl

### Example: Get Cart
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Example: Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "productId": "product-id",
    "quantity": 1
  }'
```

---n
## Testing via Frontend

The easiest way to test is through the frontend:

1. **Start dev server**: `npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Login** to your account
4. **Open DevTools** > Network tab
5. **Use the website** - all API calls will appear in Network tab
6. **Inspect requests** to see request/response data

---

## Expected Response Formats

### Success Response
```json
{
  "id": "...",
  "data": "..."
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Paginated Response
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

---

## Common Issues

### 401 Unauthorized
- User is not logged in
- Session token is invalid/expired
- Cookie is not being sent

**Solution**: Login via frontend and copy the session cookie

### 404 Not Found
- Endpoint URL is incorrect
- Resource ID doesn't exist
- User doesn't have access to the resource

### 400 Bad Request
- Missing required fields
- Invalid data format
- Validation errors

**Solution**: Check the `details` field in error response for validation errors

### 500 Internal Server Error
- Server-side error
- Database connection issue
- Missing environment variables

**Solution**: Check server logs for detailed error messages

---

## Automated Testing

Use the provided test script:

```bash
node scripts/test-api.js
```

This will test all public endpoints. For authenticated endpoints, use Postman or test via frontend.

---

## Next Steps

1. Test all endpoints individually
2. Test complete user flows (add to cart → checkout → order)
3. Test error scenarios
4. Verify data persistence
5. Test with multiple users
6. Load test for performance

