import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function DashboardPage() {
    const cookieStore = await cookies()

    // Use values from .env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!supabaseUrl || !supabaseKey) {
        return redirect('/admin');
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    // In a Server Component, we can't set cookies directly on the response headers 
                    // in the same way, but SSR client mostly uses 'get' for reading session.
                    // For standard server components just reading session, this is usually sufficient.
                },
                remove(name: string, options: CookieOptions) {
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()


    if (!session) {
        redirect('/admin')
    }

    return <AdminDashboard />
}
