import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create server-side Supabase client
export async function createSupabaseServerClient() {
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables")
	}

	const cookieStore = await cookies()

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options)
					})
				} catch (error) {
					console.error("Error setting cookies:", error)
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			},
		},
	})
}

// Get user on server (using getUser() for security)
export async function getServerSession() {
	try {
		const supabase = await createSupabaseServerClient()
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			console.error("Error getting user:", error)
			return null
		}

		// Return session-like object for backward compatibility
		return user ? { user } : null
	} catch (error) {
		console.error("Error creating Supabase client:", error)
		return null
	}
}
