import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

// Type helpers
type Profile = Database['public']['Tables']['profile']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type Experience = Database['public']['Tables']['experience']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type SocialLink = Database['public']['Tables']['social_links']['Row'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Insert'];

// ==================== PROFILE ====================
export async function getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

export async function updateProfile(profile: Partial<Profile> & { id: string }): Promise<{ error: Error | null }> {
    try {
        const { id, ...updates } = profile;
        const { error } = await supabase
            .from('profile')
            // @ts-expect-error - Supabase generated types issue
            .update(updates as any)
            .eq('id', id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
}

// ==================== SKILLS ====================
export async function getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }

    return data || [];
}

export async function getAllSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching all skills:', error);
        return [];
    }

    return data || [];
}

export async function addSkill(skill: Database['public']['Tables']['skills']['Insert']) {
    const { data, error } = await supabase
        .from('skills')
        .insert(skill)
        .select()
        .single();

    return { data, error };
}

export async function updateSkill(id: string, skill: Partial<Skill>) {
    const { data, error } = await supabase
        .from('skills')
        .update(skill)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

export async function deleteSkill(id: string) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    return { error };
}

// ==================== EXPERIENCE ====================
export async function getExperience(): Promise<Experience[]> {
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('is_visible', true)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching experience:', error);
        return [];
    }

    return data || [];
}

export async function getAllExperience(): Promise<Experience[]> {
    const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching all experience:', error);
        return [];
    }

    return data || [];
}

export async function addExperience(experience: Database['public']['Tables']['experience']['Insert']) {
    const { data, error } = await supabase
        .from('experience')
        .insert(experience)
        .select()
        .single();

    return { data, error };
}

export async function updateExperience(id: string, experience: Partial<Experience>) {
    const { data, error } = await supabase
        .from('experience')
        .update(experience)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

export async function deleteExperience(id: string) {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    return { error };
}

// ==================== PROJECTS ====================
export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data || [];
}

export async function getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching all projects:', error);
        return [];
    }

    return data || [];
}

export async function addProject(project: Database['public']['Tables']['projects']['Insert']) {
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

    return { data, error };
}

export async function updateProject(id: string, project: Partial<Project>) {
    const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

export async function deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
}

// ==================== CERTIFICATIONS ====================
export async function getCertifications() {
    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching certifications:', error);
        return [];
    }
    return data || [];
}

export async function getAllCertifications() {
    const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching all certifications:', error);
        return [];
    }
    return data || [];
}

export async function addCertification(cert: any) {
    const { data, error } = await supabase
        .from('certifications')
        .insert(cert)
        .select()
        .single();
    return { data, error };
}

export async function updateCertification(id: string, cert: any) {
    const { data, error } = await supabase
        .from('certifications')
        // @ts-expect-error - Supabase generated types issue
        .update(cert as any)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteCertification(id: string) {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    return { error };
}

// ==================== EDUCATION ====================
export async function getEducation(): Promise<Education[]> {
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('is_visible', true)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching education:', error);
        return [];
    }

    return data || [];
}

export async function getAllEducation(): Promise<Education[]> {
    const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching all education:', error);
        return [];
    }

    return data || [];
}

export async function addEducation(education: Database['public']['Tables']['education']['Insert']) {
    const { data, error } = await supabase
        .from('education')
        .insert(education)
        .select()
        .single();

    return { data, error };
}

export async function updateEducation(id: string, education: Partial<Education>) {
    const { data, error } = await supabase
        .from('education')
        .update(education)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

export async function deleteEducation(id: string) {
    const { error } = await supabase.from('education').delete().eq('id', id);
    return { error };
}

// ==================== SOCIAL LINKS ====================
export async function getSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching social links:', error);
        return [];
    }

    return data || [];
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching all social links:', error);
        return [];
    }

    return data || [];
}

export async function addSocialLink(link: Database['public']['Tables']['social_links']['Insert']) {
    const { data, error } = await supabase
        .from('social_links')
        .insert(link)
        .select()
        .single();

    return { data, error };
}

export async function updateSocialLink(id: string, link: Partial<SocialLink>) {
    const { data, error } = await supabase
        .from('social_links')
        .update(link)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
}

export async function deleteSocialLink(id: string) {
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    return { error };
}

// ==================== CONTACT MESSAGES ====================
export async function submitContactMessage(message: ContactMessage) {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select()
        .single();

    return { data, error };
}

export async function getContactMessages() {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    return { data, error };
}

export async function markMessageAsRead(id: string) {
    const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

    return { error };
}
// ==================== SITE SETTINGS ====================
export async function getSiteSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*');

    if (error) {
        console.error('Error fetching site settings:', error);
        return {};
    }

    return data.reduce((acc, setting) => {
        let value = setting.value;
        if (setting.type === 'json' && value) {
            try { value = JSON.parse(value); } catch (e) { }
        } else if (setting.type === 'number' && value) {
            value = Number(value);
        } else if (setting.type === 'boolean' && value) {
            value = value === 'true';
        }
        acc[setting.key] = value;
        return acc;
    }, {} as Record<string, any>);
}

export async function updateSiteSetting(key: string, value: any, type: string = 'string') {
    let stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value: stringValue, type })
        .select()
        .single();

    return { data, error };
}
