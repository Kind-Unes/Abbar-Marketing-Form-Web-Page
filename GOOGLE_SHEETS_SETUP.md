# 📝 HOW TO CONNECT YOUR FORM TO GOOGLE SHEETS

## Step-by-Step Setup Guide

### STEP 1: Create a Google Sheet

1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it "Abbar Form Submissions" (or any name you like)
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
                                         ^^^^^^^^^^^^^^^^^^^^
                                         Copy this part!
   ```

---

### STEP 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the entire code from `google-apps-script.js` file
4. Replace `'YOUR_SPREADSHEET_ID_HERE'` with your actual Spreadsheet ID (line 12)

---

### STEP 3: Deploy as Web App

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Abbar Form Submission Handler"
   - **Execute as**: Me (your-email@gmail.com)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Review permissions → Click **Review permissions**
7. Choose your Google account
8. Click **Advanced** → **Go to [Project name] (unsafe)**
9. Click **Allow**
10. **COPY THE WEB APP URL** — it looks like:
    ```
    https://script.google.com/macros/s/AKfycbz...../exec
    ```

---

### STEP 4: Update Your Code

Open `src/Layout.jsx` and replace line 8:

**CHANGE THIS:**

```javascript
GOOGLE_SCRIPT_URL: "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE",
```

**TO THIS:**

```javascript
GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec",
```

---

### STEP 5: Test Your Form

1. Rebuild your app:

   ```powershell
   npm run build
   ```

2. Deploy to Firebase:

   ```powershell
   firebase deploy --only hosting --project abbar-form
   ```

3. Submit a test form on your website
4. Check your Google Sheet — you should see a new row with the submission!

---

## 📊 What Data Gets Saved?

Your Google Sheet will automatically capture:

- ✅ Timestamp
- ✅ Name
- ✅ Phone Number
- ✅ Language (Arabic/English)
- ✅ Date & Time
- ✅ User's Timezone & Country
- ✅ Device Info (Platform, Screen Size)
- ✅ Mobile/Desktop indicator
- ✅ Browser details
- ✅ Referrer (where they came from)
- ✅ Page URL

---

## 🔔 Optional: Email Notifications

To get email alerts when someone submits the form:

1. Open `google-apps-script.js`
2. Find lines 58-72 (the commented email section)
3. Uncomment the code (remove `/*` and `*/`)
4. Replace `'your-email@example.com'` with your actual email
5. Redeploy the script:
   - Apps Script → **Deploy** → **Manage deployments**
   - Click pencil icon ✏️ → **Version**: New version
   - Click **Deploy**

---

## 🛠️ Troubleshooting

**Problem: Form submissions not appearing in sheet**

- Check that you copied the correct Web App URL
- Make sure you deployed as "Anyone" can access
- Check Apps Script logs: **Executions** tab in Apps Script editor

**Problem: Permission denied error**

- Redeploy and grant permissions again
- Make sure "Execute as: Me" is selected

**Problem: CORS errors in browser console**

- This is normal! The script uses `mode: "no-cors"`
- Data still gets saved even if you see the error

---

## 🎯 Quick Reference

**Your Spreadsheet ID:**

```
[Paste your ID here after copying]
```

**Your Web App URL:**

```
[Paste your deployment URL here after deploying]
```

---

## ✅ Checklist

- [ ] Created Google Sheet
- [ ] Copied Spreadsheet ID
- [ ] Created Apps Script
- [ ] Replaced Spreadsheet ID in script
- [ ] Deployed as Web App
- [ ] Copied Web App URL
- [ ] Updated `GOOGLE_SCRIPT_URL` in Layout.jsx
- [ ] Rebuilt and deployed app
- [ ] Tested form submission
- [ ] Verified data in Google Sheet

---

**Need help?** The script logs all activity. Check:

- Apps Script → **Executions** tab for runtime logs
- Your Google Sheet should auto-create headers on first submission
