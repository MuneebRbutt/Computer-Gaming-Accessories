# Troubleshooting Signup Error

## Common Issues and Solutions

### 1. Database Connection Error

**Error**: "Internal server error" or "Database connection failed"

**Solution**:
- Check your `DATABASE_URL` in `.env.local`
- Ensure MongoDB is running (if using local MongoDB)
- Verify the connection string format:
  ```
  DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"
  ```
  or for MongoDB Atlas:
  ```
  DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"
  ```

### 2. Missing Environment Variables

**Error**: "Internal server error"

**Solution**:
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Generate a secret: `openssl rand -base64 32`
- Set `NEXTAUTH_URL` to your app URL

### 3. User Already Exists

**Error**: "User already exists with this email"

**Solution**:
- Try logging in instead
- Or use a different email address

### 4. Validation Errors

**Error**: Field-specific errors shown

**Solution**:
- Check that all required fields are filled
- Ensure email is in valid format
- Password must be at least 6 characters

### 5. Browser Console Errors

**Common errors**:
- CORS errors: Check Next.js configuration
- Network errors: Check if server is running
- JSON parsing errors: Check API response format

## Debugging Steps

1. **Check Server Logs**:
   ```bash
   # Look for errors in terminal where you ran `npm run dev`
   ```

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages

3. **Check Network Tab**:
   - Open DevTools > Network
   - Try signing up again
   - Click on the `/api/auth/signup` request
   - Check Response tab for error details

4. **Verify Database**:
   ```bash
   # Check if Prisma can connect
   npm run db:studio
   ```

5. **Test API Directly**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "test123"
     }'
   ```

## Quick Fixes

### Reset Database (if needed)
```bash
npm run db:reset
npm run db:push
```

### Check Prisma Client
```bash
npm run db:generate
```

### Verify Environment Variables
```bash
# In nextjs directory
cat .env.local
# Make sure DATABASE_URL and NEXTAUTH_SECRET are set
```

## Still Having Issues?

1. Check the server terminal for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Try creating a user directly in the database to test connection
5. Check if Prisma schema matches your database

