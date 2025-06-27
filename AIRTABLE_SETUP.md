# 🗂️ Airtable Integration Setup

This guide will help you set up Airtable as the database for your Shopify Calendar.

## 🎯 Why Airtable?

- ✅ **Easy Setup** - No database server required
- ✅ **Visual Interface** - Manage events in a spreadsheet-like interface
- ✅ **Real-time Sync** - Multiple users can access the same data
- ✅ **Free Tier** - Up to 1,200 records per base
- ✅ **API Access** - Powerful REST API for integration
- ✅ **Backup & Export** - Built-in data protection

## 📋 Prerequisites

1. **Airtable Account** - Sign up at [airtable.com](https://airtable.com)
2. **Node.js Environment** - For environment variables

## 🚀 Step-by-Step Setup

### Step 1: Create Airtable Base

1. **Login to Airtable** and create a new base
2. **Name your base**: "Shopify Calendar" (or whatever you prefer)
3. **Create a table** named: `Calendar Events`

### Step 2: Set Up Table Structure

Create these fields in your `Calendar Events` table:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `ID` | Single line text | Unique event identifier |
| `Title` | Single line text | Event title |
| `Description` | Long text | Event description |
| `StartDate` | Date & time | Event start date/time |
| `EndDate` | Date & time | Event end date/time |
| `Type` | Single select | Options: `order`, `inventory`, `marketing`, `promotion` |
| `Status` | Single select | Options: `pending`, `active`, `completed` |
| `CreatedAt` | Date & time | Auto-populated creation time |
| `UpdatedAt` | Date & time | Auto-populated update time |

### Step 3: Configure Single Select Options

**For the `Type` field:**
- `order` (Green)
- `inventory` (Orange) 
- `marketing` (Purple)
- `promotion` (Red)

**For the `Status` field:**
- `pending` (Yellow)
- `active` (Green)
- `completed` (Gray)

### Step 4: Get API Credentials

1. **Get Base ID:**
   - Go to [airtable.com/api](https://airtable.com/api)
   - Select your base
   - Copy the Base ID (starts with `app`)

2. **Get API Key:**
   - Go to [airtable.com/account](https://airtable.com/account)
   - Generate a Personal Access Token
   - Give it permissions: `data.records:read`, `data.records:write`
   - Copy the token (starts with `pat`)

### Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Airtable Configuration
REACT_APP_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
REACT_APP_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXX

# Storage Mode (choose one)
REACT_APP_STORAGE_MODE=hybrid  # Recommended
# REACT_APP_STORAGE_MODE=airtable  # Airtable only
# REACT_APP_STORAGE_MODE=localStorage  # Local only
```

### Step 6: Test the Integration

1. **Restart your development server:**
   ```bash
   npm start
   ```

2. **Create a test event** in your calendar
3. **Check Airtable** - The event should appear in your table!
4. **Edit in Airtable** - Changes should sync back to your calendar

## 🔧 Storage Modes Explained

### 📱 localStorage (Default)
- Events stored in browser only
- Fast and reliable
- No internet required
- Not shared between devices

### ☁️ airtable
- Events stored in Airtable only
- Shared across devices/users
- Requires internet connection
- Visual data management

### 🔄 hybrid (Recommended)
- Primary: Airtable storage
- Backup: localStorage
- Best of both worlds
- Offline fallback capability

## 🛠️ Troubleshooting

### Common Issues:

**"Airtable not configured" error:**
- Check your `.env` file exists
- Verify environment variable names
- Restart the development server

**API permission errors:**
- Ensure your Personal Access Token has read/write permissions
- Check that the Base ID is correct

**Events not syncing:**
- Check browser console for errors
- Verify table structure matches exactly
- Ensure field names are spelled correctly

### Debug Mode:

Add this to your `.env` for detailed logging:
```bash
REACT_APP_DEBUG_AIRTABLE=true
```

## 📊 Managing Data in Airtable

### Views You Can Create:
- **📅 By Date** - Sort events chronologically
- **🏷️ By Type** - Group by event type
- **⚡ By Status** - Filter active/pending events
- **📈 Analytics** - Summary statistics

### Advanced Features:
- **🔗 Linked Records** - Connect to customer/product tables
- **📸 Attachments** - Add files to events
- **🤖 Automations** - Auto-create events from triggers
- **📧 Notifications** - Email alerts for upcoming events

## 🔮 Next Steps

1. **Custom Fields** - Add specific fields for your business
2. **Shopify Integration** - Connect with Shopify APIs
3. **Team Collaboration** - Share base with team members
4. **Mobile Access** - Use Airtable mobile app
5. **Advanced Automations** - Set up workflow triggers

## 🔒 Security Best Practices

- ✅ **Keep API keys secure** - Never commit to version control
- ✅ **Use environment variables** - Store credentials safely
- ✅ **Limit permissions** - Only grant necessary access
- ✅ **Regular backups** - Export data periodically
- ✅ **Monitor usage** - Check API call limits

---

## 🆘 Need Help?

- **Airtable Documentation**: [airtable.com/developers](https://airtable.com/developers)
- **API Reference**: [airtable.com/api](https://airtable.com/api)
- **Community Support**: [community.airtable.com](https://community.airtable.com)

Happy calendar management! 🎉 