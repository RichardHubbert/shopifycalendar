# 🔐 Supabase Authentication Setup

This guide will help you set up Supabase authentication for your Shopify Calendar.

## 🎯 Why Supabase?

- ✅ **Easy Setup** - Simple authentication with email/password
- ✅ **Secure** - Built-in security features
- ✅ **Free Tier** - Generous free plan
- ✅ **Real-time** - Live authentication state updates
- ✅ **Admin Control** - Only admins can modify events

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js Environment** - For environment variables

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Login to Supabase** and create a new project
2. **Name your project**: "Shopify Calendar" (or whatever you prefer)
3. **Choose a database password** (save this for later)
4. **Select a region** close to your users

### Step 2: Get API Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy the Project URL** (starts with `https://`)
3. **Copy the anon/public key** (starts with `eyJ`)

### Step 3: Configure Environment Variables

Add these to your `.env` file:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_ADMIN_EMAIL=admin@theaidesign.co.uk
```

### Step 4: Create Admin User

1. **Go to Authentication → Users** in Supabase
2. **Click "Add User"**
3. **Enter admin email**: `admin@theaidesign.co.uk`
4. **Set a secure password**
5. **Click "Create User"**

### Step 5: Configure Authentication Settings

1. **Go to Authentication → Settings**
2. **Enable Email Auth** (should be enabled by default)
3. **Disable Email Confirmations** (optional, for easier testing)
4. **Save changes**

## 🔧 Admin Access Control

The calendar uses these rules to determine admin access:

- **Primary**: Email matches `REACT_APP_ADMIN_EMAIL`
- **Fallback**: Email ends with `@theaidesign.co.uk`

You can customize this logic in `src/contexts/AuthContext.tsx`:

```typescript
const isAdmin = Boolean(
  user?.email === process.env.REACT_APP_ADMIN_EMAIL || 
  user?.email?.endsWith('@theaidesign.co.uk')
);
```

## 🎯 Features by User Type

### 👤 **Admin Users** (Authenticated + Admin Email)
- ✅ View all events
- ✅ Create new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ Clear all events
- ✅ Full Airtable sync

### 👁️ **Viewer Users** (Authenticated + Non-Admin Email)
- ✅ View all events
- ❌ Cannot create events
- ❌ Cannot edit events
- ❌ Cannot delete events

### 🚫 **Unauthenticated Users**
- ❌ Cannot access calendar
- ❌ Redirected to login page

## 🛠️ Testing the Setup

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Go to http://localhost:3000**
3. **You should see the login page**
4. **Sign in with your admin credentials**
5. **You should see the calendar with admin features**

## 🔒 Security Best Practices

- ✅ **Use HTTPS** in production
- ✅ **Set strong admin passwords**
- ✅ **Regularly rotate API keys**
- ✅ **Monitor authentication logs**
- ✅ **Use environment variables** for secrets

## 🆘 Troubleshooting

### "Supabase credentials not found"
- Check your `.env` file exists
- Verify environment variable names
- Restart your development server

### "Invalid login credentials"
- Check email/password in Supabase dashboard
- Ensure user exists in Authentication → Users
- Try creating a new user

### "Admin features not showing"
- Check your email matches admin criteria
- Verify `REACT_APP_ADMIN_EMAIL` is set correctly
- Check browser console for errors

---

## 🎉 Next Steps

1. **Test authentication** with your admin account
2. **Create additional users** if needed
3. **Customize admin logic** for your needs
4. **Deploy to production** with proper environment variables

Your Shopify Calendar is now secure and admin-only! 🔐 