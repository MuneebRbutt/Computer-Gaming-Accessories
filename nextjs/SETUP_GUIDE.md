
# Complete Setup Guide

## 1. Environment Setup

Copy the example environment file and fill in your values:

```powershell
cp .env.example .env
```

### Required Variables:
- **DATABASE_URL**: MongoDB connection string.
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`.
- **IMAGEKIT_KEYS**: Get these from your ImageKit dashboard for file uploads.
- **STRIPE_KEYS**: Get from Stripe dashboard for payments.

## 2. Install Dependencies

```powershell
npm install
```

## 3. Database Setup

The project uses Prisma as the main ORM. Run these commands to sync your database:

```powershell
# Generate Prisma Client
npm run db:generate

# Push schema to MongoDB (Initial setup)
npm run db:push
```

## 4. Run the Application

```powershell
# Development server
npm run dev
```

Visit `http://localhost:3000` to see your app.

## 5. Admin Access

To access admin features (Product creation, etc.):
1. Sign up a new user.
2. Manually update their role to `ADMIN` in your MongoDB database (users collection).
   - Or use a database GUI like Compass to edit the user document.

## 6. Features Overview

### Authentication
- Users can sign up and login.
- Admin protection on specific routes.

### Product Management
- **GET /api/products**: List all products.
- **POST /api/products**: Create product (Admin).
- **PUT /api/products/[id]**: Update product (Admin).
- **DELETE /api/products/[id]**: Delete product (Admin).

### File Uploads
- **POST /api/upload**: Upload images via ImageKit. Returns URL.

### Search
- **GET /api/search?q=query**: Search for products by title, description, or tags.

### Mongoose Connection
- A secondary Mongoose connection is established in `lib/mongoose.ts` for any specific Mongoose-only requirements.
