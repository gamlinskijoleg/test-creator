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

// Get user on server (using getSession() which doesn't throw when no session exists)
export async function getServerSession() {
	try {
		const supabase = await createSupabaseServerClient()
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession()

		if (error) {
			// Silently handle authentication errors - user is not authenticated
			const errorMessage = error.message || ""
			if (
				errorMessage.includes("User from sub claim in JWT does not exist")
				|| errorMessage.includes("JWT")
				|| errorMessage.includes("invalid")
				|| errorMessage.includes("session")
			) {
				return null
			}
			console.error("Error getting session:", error)
			return null
		}

		// Return session-like object for backward compatibility
		return session?.user ? { user: session.user } : null
	} catch (error) {
		// Handle any unexpected errors gracefully
		// This includes AuthApiError and AuthSessionMissingError exceptions
		const errorMessage = error instanceof Error ? error.message : String(error)
		if (
			errorMessage.includes("User from sub claim in JWT does not exist")
			|| errorMessage.includes("JWT")
			|| errorMessage.includes("AuthApiError")
			|| errorMessage.includes("AuthSessionMissingError")
			|| errorMessage.includes("session")
		) {
			return null
		}
		console.error("Error creating Supabase client:", error)
		return null
	}
}
