export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profile: {
                Row: {
                    id: string
                    name: string
                    title: string | null
                    bio: string | null
                    image_url: string | null
                    location: string | null
                    email: string | null
                    phone: string | null
                    resume_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    title?: string | null
                    bio?: string | null
                    image_url?: string | null
                    location?: string | null
                    email?: string | null
                    phone?: string | null
                    resume_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    title?: string | null
                    bio?: string | null
                    image_url?: string | null
                    location?: string | null
                    email?: string | null
                    phone?: string | null
                    resume_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            skills: {
                Row: {
                    id: string
                    name: string
                    category: string
                    proficiency_level: number | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    proficiency_level?: number | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    proficiency_level?: number | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            experience: {
                Row: {
                    id: string
                    company: string
                    position: string
                    location: string | null
                    start_date: string
                    end_date: string | null
                    description: string | null
                    achievements: string[] | null
                    technologies: string[] | null
                    company_url: string | null
                    logo_url: string | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    company: string
                    position: string
                    location?: string | null
                    start_date: string
                    end_date?: string | null
                    description?: string | null
                    achievements?: string[] | null
                    technologies?: string[] | null
                    company_url?: string | null
                    logo_url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    company?: string
                    position?: string
                    location?: string | null
                    start_date?: string
                    end_date?: string | null
                    description?: string | null
                    achievements?: string[] | null
                    technologies?: string[] | null
                    company_url?: string | null
                    logo_url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string
                    long_description: string | null
                    tech_stack: string[]
                    image_url: string | null
                    gallery_urls: string[] | null
                    demo_url: string | null
                    github_url: string | null
                    start_date: string | null
                    end_date: string | null
                    is_featured: boolean
                    category: string | null
                    metrics: Json | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    long_description?: string | null
                    tech_stack: string[]
                    image_url?: string | null
                    gallery_urls?: string[] | null
                    demo_url?: string | null
                    github_url?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_featured?: boolean
                    category?: string | null
                    metrics?: Json | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    long_description?: string | null
                    tech_stack?: string[]
                    image_url?: string | null
                    gallery_urls?: string[] | null
                    demo_url?: string | null
                    github_url?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    is_featured?: boolean
                    category?: string | null
                    metrics?: Json | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            education: {
                Row: {
                    id: string
                    institution: string
                    degree: string
                    field_of_study: string | null
                    location: string | null
                    start_date: string
                    end_date: string | null
                    grade: string | null
                    description: string | null
                    achievements: string[] | null
                    logo_url: string | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    institution: string
                    degree: string
                    field_of_study?: string | null
                    location?: string | null
                    start_date: string
                    end_date?: string | null
                    grade?: string | null
                    description?: string | null
                    achievements?: string[] | null
                    logo_url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    institution?: string
                    degree?: string
                    field_of_study?: string | null
                    location?: string | null
                    start_date?: string
                    end_date?: string | null
                    grade?: string | null
                    description?: string | null
                    achievements?: string[] | null
                    logo_url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            social_links: {
                Row: {
                    id: string
                    platform: string
                    url: string
                    icon_name: string | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    platform: string
                    url: string
                    icon_name?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    platform?: string
                    url?: string
                    icon_name?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            site_settings: {
                Row: {
                    id: string
                    key: string
                    value: string | null
                    type: string
                    description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value?: string | null
                    type?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: string | null
                    type?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            certifications: {
                Row: {
                    id: string
                    name: string
                    institution: string
                    date: string | null
                    issuer: string | null
                    image_url: string | null
                    url: string | null
                    order_index: number
                    is_visible: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    institution: string
                    date?: string | null
                    issuer?: string | null
                    image_url?: string | null
                    url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    institution?: string
                    date?: string | null
                    issuer?: string | null
                    image_url?: string | null
                    url?: string | null
                    order_index?: number
                    is_visible?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string | null
                    message: string
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject?: string | null
                    message: string
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string | null
                    message?: string
                    is_read?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
