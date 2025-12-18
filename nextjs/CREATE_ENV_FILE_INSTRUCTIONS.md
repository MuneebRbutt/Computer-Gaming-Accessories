# How to Create .env.local File

Since `.env.local` files are protected, you need to create it manually. Here are **3 easy ways**:

---

## Method 1: Use PowerShell Script (Easiest)

1. **Open PowerShell** in the `nextjs` folder:
   ```powershell
   cd "C:\Users\HP\Documents\Computer Gaming\Computer-Gaming-Accessories\nextjs"
   ```

2. **Run the script**:
   ```powershell
   .\create-env-file.ps1
   ```

3. **Edit the file**:
   - Open `.env.local` in your editor
   - Replace `DATABASE_URL` with your actual MongoDB connection string
   - Generate `NEXTAUTH_SECRET` (see below)

---

## Method 2: Create Manually in VS Code/Cursor

1. **Open the `nextjs` folder** in VS Code/Cursor

2. **Create new file**:
   - Right-click in the file explorer
   - Select "New File"
   - Name it: `.env.local`

3. **Copy and paste this content**:

```env
# Database Connection
# Replace with your MongoDB connection string
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email Service (Resend) - Optional
RESEND_API_KEY=""
RESEND_DOMAIN=""

# Payment Processing (Stripe) - Optional
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Save the file** (Ctrl+S)

---

## Method 3: Create via Command Line

**In PowerShell:**
```powershell
cd "C:\Users\HP\Documents\Computer Gaming\Computer-Gaming-Accessories\nextjs"

@"
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env.local" -Encoding utf8
```

---

## After Creating .env.local

### 1. Update DATABASE_URL

Replace the placeholder with your actual MongoDB connection string:

**For MongoDB Atlas:**
```env
DATABASE_URL="mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/computer-gaming-accessories?retryWrites=true&w=majority"
```

**For Local MongoDB:**
```env
DATABASE_URL="mongodb://localhost:27017/computer-gaming-accessories"
```

### 2. Generate NEXTAUTH_SECRET

**In PowerShell:**
```powershell
# Generate a random secret
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Or use online generator:**
- Go to: https://generate-secret.vercel.app/32
- Copy the generated secret
- Paste it in `.env.local` as `NEXTAUTH_SECRET`

### 3. Test Your Setup

```powershell
# Make sure you're in the nextjs folder
cd "C:\Users\HP\Documents\Computer Gaming\Computer-Gaming-Accessories\nextjs"

# Test database connection
npm run db:push
```

If successful, you'll see: ✅ "Database synchronized successfully"

---

## File Location

Make sure `.env.local` is in this location:
```
Computer-Gaming-Accessories/
└── nextjs/
    ├── .env.local          ← HERE!
    ├── package.json
    ├── prisma/
    └── ...
```

---

## Troubleshooting

### File not found error?
- Make sure file is named exactly `.env.local` (with the dot at the start)
- Make sure it's in the `nextjs` folder (same folder as `package.json`)

### Still getting DATABASE_URL error?
1. Close and reopen your terminal/PowerShell
2. Restart VS Code/Cursor
3. Verify file exists: `Get-Content .env.local` (in PowerShell)

### File is hidden?
- In VS Code/Cursor, files starting with `.` are hidden by default
- Look in the file explorer - you might need to show hidden files
- Or use: `code .env.local` to open it directly

---

## Quick Checklist

- [ ] `.env.local` file created in `nextjs` folder
- [ ] `DATABASE_URL` updated with your MongoDB connection string
- [ ] `NEXTAUTH_SECRET` generated and added
- [ ] File saved
- [ ] Terminal restarted
- [ ] Tested with `npm run db:push`

