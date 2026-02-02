-- =============================================
-- PORTFOLIO PLATFORM - STORAGE SETUP
-- Run this script in the Supabase SQL Editor
-- =============================================

-- 1. Create Storage Buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('company-logos', 'company-logos', true),
  ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Security Policies for Storage

-- Allow Public Read Access (Images are visible to everyone)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('profile-images', 'project-images', 'company-logos', 'resumes') );

-- Allow Authenticated Uploads (Only you can upload)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' AND bucket_id IN ('profile-images', 'project-images', 'company-logos', 'resumes') );

-- Allow Authenticated Updates
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( auth.role() = 'authenticated' AND bucket_id IN ('profile-images', 'project-images', 'company-logos', 'resumes') );

-- Allow Authenticated Deletes
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( auth.role() = 'authenticated' AND bucket_id IN ('profile-images', 'project-images', 'company-logos', 'resumes') );
