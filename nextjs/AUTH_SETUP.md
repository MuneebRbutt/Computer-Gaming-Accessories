# Authentication Setup Guide

## Overview
The authentication system is now functional with email/password login and signup. Google OAuth is optional.

## Quick Start

### 1. Environment Variables (Optional)
Create a `.env.local` file in the root directory with:

```bash
# Required for production
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Optional - for Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Demo Accounts
The system comes with pre-configured demo accounts:

**Regular User:**
- Email: `user@example.com`
- Password: `password`

**Admin User:**
- Email: `admin@example.com`
- Password: `password`

### 3. Features

#### ✅ Working Features:
- Email/password registration
- Email/password login
- Session management
- Protected routes
- Form validation
- Error handling
- Toast notifications
- Responsive design

#### 🔧 Optional Features:
- Google OAuth (requires setup)
- Database integration (currently uses in-memory storage)

### 4. How to Use

1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Use email and password to sign in
3. **Demo Login**: Use the demo accounts for testing

### 5. File Structure

```
lib/
  auth.ts          # NextAuth configuration
  users.ts         # User storage and utilities
app/
  api/auth/
    [...nextauth]/  # NextAuth API routes
    signup/         # User registration API
  login/           # Login page
  signup/          # Registration page
```

### 6. Production Notes

- Replace in-memory user storage with a proper database
- Set strong NEXTAUTH_SECRET
- Configure proper Google OAuth if needed
- Add email verification
- Implement password reset functionality

## Troubleshooting

If authentication isn't working:

1. Check if the Next.js server is running
2. Verify all required dependencies are installed
3. Check browser console for errors
4. Ensure forms are being submitted properly

