# 🚀 Personal Portfolio Platform

A complete, production-ready personal portfolio platform built with **Next.js**, **TypeScript**, and **Supabase**. Features a beautiful resume-first editorial theme, full CMS admin dashboard, and seamless database integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Supabase Setup](#supabase-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Admin Dashboard](#admin-dashboard)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## ✨ Features

### Public Portfolio
- ✅ **Resume-First Editorial Theme** - Clean, professional design optimized for recruiters
- ✅ **Responsive Design** - Mobile-first, works perfectly on all devices
- ✅ **Hero Section** - Profile image, bio, social links, and CTAs
- ✅ **Skills Section** - Categorized skills with proficiency indicators
- ✅ **Experience Timeline** - Professional work history with achievements
- ✅ **Projects Showcase** - Portfolio projects with images and tech stacks
- ✅ **Education Section** - Academic background and achievements
- ✅ **Contact Form** - Direct message submission to database

### Admin Dashboard
- ✅ **Secure Authentication** - Powered by Supabase Auth
- ✅ **Profile Management** - Edit personal info, upload images and resume
- ✅ **Skills Editor** - Add/edit/delete skills with categories
- ✅ **Social Links Manager** - Manage all social media profiles
- ✅ **Image Upload** - Direct uploads to Supabase Storage
- ✅ **Real-time Updates** - Changes reflect immediately on the public site
- ✅ **Responsive Admin UI** - Works great on desktop and mobile

### Technical
- ✅ **TypeScript** - Full type safety across frontend and backend
- ✅ **Server Components** - Optimized Next.js 14 App Router
- ✅ **Database** - PostgreSQL via Supabase with RLS
- ✅ **File Storage** - Supabase Storage for images and files
- ✅ **Authentication** - Supabase Auth with session management
- ✅ **SEO Ready** - Proper meta tags and semantic HTML

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, CSS Modules |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Database** | PostgreSQL with Row Level Security |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage Buckets |
| **Deployment** | Vercel (recommended) |

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Supabase account** (free tier works perfectly)
- **Git** (for version control)

## 🚀 Installation

### 1. Clone or Navigate to Project

```bash
cd c:\Users\savan\Desktop\hanna
```

### 2. Install Dependencies

```bash
npm install
```

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: Portfolio
   - **Database Password**: (save this!)
   - **Region**: Choose closest to your users
5. Wait for project to provision (~2 minutes)

### Step 2: Run Database Schema

1. In Supabase Dashboard, navigate to **SQL Editor**
2. Create a **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into SQL Editor
5. Click **Run** (bottom right)
6. Verify tables were created under **Table Editor**

### Step 3: Create Storage Buckets

1. Navigate to **Storage** in Supabase Dashboard
2. Click **"New Bucket"** and create these buckets:

| Bucket Name | Public Access |
|-------------|--------------|
| `profile-images` | ✅ Public |
| `project-images` | ✅ Public |
| `company-logos` | ✅ Public |
| `resumes` | ✅ Public |

3. For each bucket, go to **Policies** and add:
   - **Public READ access**: Allow everyone to view
   - **Authenticated WRITE access**: Allow logged-in users to upload

#### Example Policy for Public Read:
```sql
-- In Storage > Policies > New Policy
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );
```

### Step 4: Create Admin User

1. Navigate to **Authentication** > **Users**
2. Click **"Add User"**
3. Create admin account:
   - **Email**: your-admin@email.com
   - **Password**: (strong password)
   - **Auto Confirm User**: ✅ Yes
4. Save credentials securely

## 🔐 Environment Variables

### 1. Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (keep this secret!)

### 2. Configure `.env.local`

Update the `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Important**: Never commit `.env.local` to Git! It's already in `.gitignore`.

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

Visit:
- **Portfolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (after login)

### Production Build

```bash
npm run build
npm start
```

## 🔑 Admin Dashboard

### Accessing the Admin

1. Navigate to: `http://localhost:3000/admin`
2. Log in with the admin credentials you created in Supabase
3. You'll be redirected to: `/admin/dashboard`

### Admin Features

| Section | Features |
|---------|----------|
| **Profile** | Update name, title, bio, contact info, upload image & resume |
| **Skills** | Add/edit/delete skills, organize by category, set proficiency |
| **Experience** | View and manage work experience (full editor coming soon) |
| **Projects** | View portfolio projects (full editor coming soon) |
| **Education** | View educational background (full editor coming soon) |
| **Social Links** | Add/edit/delete social media profiles |

### How to Add Content

1. **Log in** to admin dashboard
2. **Select a tab** (Profile, Skills, etc.)
3. **Click "Add"** or edit existing items
4. **Upload images** directly to Supabase Storage
5. **Save changes** - they appear instantly on the public site!

## 📊 Database Schema

The database includes these tables:

- **profile** - Personal information
- **skills** - Technical skills with categories
- **experience** - Work history
- **projects** - Portfolio projects
- **education** - Academic background
- **social_links** - Social media profiles
- **site_settings** - Global site configuration
- **contact_messages** - Messages from contact form

All tables have:
- ✅ UUID primary keys
- ✅ Timestamps (created_at, updated_at)
- ✅ Row Level Security (RLS)
- ✅ Proper indexes for performance

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Import Project"**
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your domain)
6. Click **Deploy**

### Update Supabase URL

After deployment, update:
1. Supabase **Authentication** > **URL Configuration**
2. Add your Vercel domain to **Site URL**
3. Add to **Redirect URLs**

## 📁 Project Structure

```
portfolio/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin routes
│   │   ├── dashboard/       # Admin dashboard
│   │   └── page.tsx         # Login page
│   ├── globals.css          # Global styles
│   └── page.tsx             # Homepage
├── components/
│   ├── admin/               # Admin components
│   │   ├── AdminDashboard.tsx
│   │   ├── ProfileEditor.tsx
│   │   ├── SkillsEditor.tsx
│   │   └── ...
│   ├── sections/            # Portfolio sections
│   │   ├── HeroSection.tsx
│   │   ├── SkillsSection.tsx
│   │   └── ...
│   └── Navbar.tsx           # Navigation
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── db.ts                # Database queries
│   ├── auth.ts              # Auth helpers
│   └── database.types.ts    # TypeScript types
├── supabase-schema.sql      # Database schema
├── .env.local               # Environment variables
└── README.md                # This file
```

## 🎨 Customization

### Colors

Edit `app/globals.css`:

```css
:root {
  --accent: #2563eb;          /* Primary color */
  --accent-light: #3b82f6;    /* Hover states */
  --background: #fafaf9;      /* Page background */
}
```

### Typography

Change fonts in `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');

:root {
  --font-sans: 'Your Font', sans-serif;
  --font-serif: 'Crimson Pro', serif;
}
```

### Sections Order

Modify the order in `app/page.tsx` to rearrange sections.

## 🛟 Troubleshooting

### Database Connection Failed
- Verify Supabase URL and keys in `.env.local`
- Check if Supabase project is active (not paused on free tier)
- Ensure RLS policies are set correctly

### Images Not Showing
- Verify storage buckets are created and set to public
- Check file was uploaded successfully
- Confirm public URL is generated correctly

### Authentication Issues
- Clear browser cookies/cache
- Verify admin user was created in Supabase Auth
- Check if RLS policies allow authenticated access

### Build Errors
- Run `npm install` again
- Delete `.next` folder and rebuild
- Check Node.js version (18+)

## 📝 License

MIT License - feel free to use this for your portfolio!

## 🙏 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase dashboard for errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
