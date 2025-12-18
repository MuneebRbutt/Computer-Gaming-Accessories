# How to Get MongoDB Database URL - Step by Step Guide

This guide will help you get your MongoDB connection string (DATABASE_URL) for your `.env.local` file.

---

## Option 1: Using MongoDB Atlas (Cloud - Recommended for Beginners)

MongoDB Atlas is a free cloud database service. This is the easiest option.

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details:
   - Email address
   - Password
   - Company name (optional)
4. Click **"Create your Atlas account"**
5. Verify your email if prompted

### Step 2: Create a Free Cluster

1. After logging in, you'll see **"Build a Database"** screen
2. Choose **"M0 FREE"** (Free tier)
3. Select a **Cloud Provider**:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. Select a **Region** closest to you (e.g., `Asia Pacific (Mumbai)` for Pakistan)
5. Click **"Create"**
6. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User

1. Once cluster is created, you'll see **"Create Database User"** screen
2. Choose **"Username and Password"** authentication
3. Enter:
   - **Username**: `admin` (or any username you prefer)
   - **Password**: Create a strong password (save it somewhere safe!)
4. Click **"Create Database User"**

### Step 4: Set Network Access (Allow Connections)

1. You'll see **"Where would you like to connect from?"** screen
2. For development, click **"Add My Current IP Address"**
3. Or click **"Allow Access from Anywhere"** (less secure, but easier for development)
   - This adds `0.0.0.0/0` to allowed IPs
4. Click **"Finish and Close"**

### Step 5: Get Your Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as driver
4. Select version **"5.5 or later"** (or latest)
5. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Copy this connection string**

### Step 6: Customize Your Connection String

Replace `<username>` and `<password>` with your database user credentials:

**Before:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (example):**
```
mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Important:** Replace `MyPassword123` with your actual password (URL encode special characters if needed)

### Step 7: Add Database Name

Add your database name before the `?`:

**Before:**
```
mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/computer-gaming-accessories?retryWrites=true&w=majority
```

### Step 8: Add to Your .env.local File

1. Open `nextjs/.env.local` file (create it if it doesn't exist)
2. Add this line:
   ```env
   DATABASE_URL="mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/computer-gaming-accessories?retryWrites=true&w=majority"
   ```
3. Replace with your actual connection string
4. Save the file

---

## Option 2: Using Local MongoDB (On Your Computer)

If you have MongoDB installed locally on your computer.

### Step 1: Install MongoDB (if not installed)

**Windows:**
1. Download MongoDB from: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
```

### Step 2: Start MongoDB Service

**Windows:**
- MongoDB should start automatically as a service
- Or open Services and start "MongoDB" service

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 3: Create Your Connection String

For local MongoDB, use this format:

```
mongodb://localhost:27017/computer-gaming-accessories
```

**Breakdown:**
- `mongodb://` - Protocol
- `localhost` - Your computer
- `27017` - Default MongoDB port
- `computer-gaming-accessories` - Your database name

### Step 4: Add to Your .env.local File

```env
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"
```

---

## Option 3: Using MongoDB Compass (GUI Tool)

MongoDB Compass is a GUI tool that can help you connect and manage your database.

### Step 1: Download MongoDB Compass

1. Go to [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
2. Download and install

### Step 2: Connect to Your Database

1. Open MongoDB Compass
2. Paste your connection string (from Atlas or local)
3. Click **"Connect"**
4. You'll see your databases

### Step 3: Get Connection String from Compass

1. In Compass, click on your connection
2. You can copy the connection string from the connection settings

---

## Complete Example .env.local File

Here's what your complete `.env.local` file should look like:

```env
# Database (MongoDB Atlas Example)
DATABASE_URL="mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/computer-gaming-accessories?retryWrites=true&w=majority"

# OR for Local MongoDB
# DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (Optional - for now)
RESEND_API_KEY=""
RESEND_DOMAIN=""

# Payment Processing (Optional - for now)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Testing Your Connection

After setting up your DATABASE_URL:

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the connection:**
   ```bash
   npm run db:push
   ```
   This will push your Prisma schema to MongoDB

3. **Open Prisma Studio to see your database:**
   ```bash
   npm run db:studio
   ```
   This opens a browser window where you can see your database

---

## Troubleshooting

### Error: "ECONNREFUSED" or "Connection refused"

**For Local MongoDB:**
- Make sure MongoDB is running
- Check if port 27017 is available
- Try: `mongod --version` to verify installation

**For MongoDB Atlas:**
- Check your IP address is whitelisted
- Verify username and password are correct
- Check if cluster is running (not paused)

### Error: "Authentication failed"

- Double-check your username and password
- Make sure you replaced `<username>` and `<password>` in connection string
- URL encode special characters in password (e.g., `@` becomes `%40`)

### Error: "Invalid connection string"

- Make sure connection string is in quotes: `"mongodb://..."`
- Check for typos
- Verify database name is correct

### URL Encoding Special Characters

If your password has special characters, encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |

**Example:**
- Password: `MyP@ssw0rd!`
- Encoded: `MyP%40ssw0rd%21`
- Connection string: `mongodb+srv://admin:MyP%40ssw0rd%21@cluster0.xxxxx.mongodb.net/...`

---

## Quick Reference

### MongoDB Atlas Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Local MongoDB Connection String Format:
```
mongodb://localhost:27017/<database-name>
```

---

## Next Steps

After setting up your DATABASE_URL:

1. ✅ Add it to `.env.local`
2. ✅ Run `npm run db:push` to create database schema
3. ✅ Run `npm run db:seed` to add sample data (optional)
4. ✅ Test signup functionality

---

## Need Help?

- **MongoDB Atlas Documentation**: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- **MongoDB Connection Strings**: [https://docs.mongodb.com/manual/reference/connection-string/](https://docs.mongodb.com/manual/reference/connection-string/)
- **Prisma MongoDB Guide**: [https://www.prisma.io/docs/concepts/database-connectors/mongodb](https://www.prisma.io/docs/concepts/database-connectors/mongodb)


