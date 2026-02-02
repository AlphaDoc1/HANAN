# 🚀 Quick Start Guide

Follow these steps to get your portfolio up and running in 10 minutes:

## Step 1: Install Dependencies ⚡

```bash
npm install
```

## Step 2: Set Up Supabase 🗄️

### A. Create Project
1. Go to https://supabase.com
2. Create a new project (save your database password!)
3. Wait ~2 minutes for provisioning

### B. Run Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Copy entire content from `supabase-schema.sql`
3. Paste and click **Run**

### C. Create Storage Buckets
In **Storage** section, create 4 public buckets:
- `profile-images`
- `project-images`
- `company-logos`
- `resumes`

For each bucket:
1. Click bucket → **Policies** → **New Policy**
2. Add public SELECT policy
3. Add authenticated INSERT policy

### D. Create Admin User
1. **Authentication** → **Users** → **Add User**
2. Email: your-email@example.com
3. Password: (strong password)
4. ✅ Auto Confirm User
5. Click Save

## Step 3: Configure Environment Variables 🔐

1. In Supabase Dashboard → **Settings** → **API**
2. Copy your credentials
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Run the Project 🏃

```bash
npm run dev
```

Visit:
- **Portfolio**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## Step 5: Add Your Content ✨

1. Log in to admin dashboard
2. Update your profile
3. Add skills, projects, experience
4. Upload profile image and resume
5. Add social links

## Step 6: Deploy to Vercel (Optional) 🌐

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main

# Then deploy on Vercel
# 1. Import project from GitHub
# 2. Add environment variables
# 3. Click Deploy
```

---

That's it! 🎉 Your portfolio is ready!

For detailed documentation, see [README.md](./README.md)
