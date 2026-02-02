import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Use createBrowserClient to ensure sessions are stored in cookies, 
// syncing perfectly with Next.js Server Components and Middleware.
export const supabase = createBrowserClient<Database>(
    isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
    supabaseAnonKey
);

// Storage buckets
export const STORAGE_BUCKETS = {
    PROFILE_IMAGES: 'profile-images',
    PROJECT_IMAGES: 'project-images',
    COMPANY_LOGOS: 'company-logos',
    RESUMES: 'resumes',
} as const;

// Helper function to get public URL for storage
export function getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

// Helper function to upload file
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<{ url: string | null; error: Error | null }> {
    try {
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;

        const url = getPublicUrl(bucket, path);
        return { url, error: null };
    } catch (error) {
        return { url: null, error: error as Error };
    }
}

// Helper function to delete file
export async function deleteFile(
    bucket: string,
    path: string
): Promise<{ error: Error | null }> {
    try {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
}
