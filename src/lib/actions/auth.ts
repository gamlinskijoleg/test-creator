"use server"

import { createSupabaseServerClient, getServerSession } from "../supabase-server"

// Get current session
export async function getSession() {
	try {
		const session = await getServerSession()
		return {
			user: session?.user ?? null,
			session: session ? { user: session.user } : null,
		}
	} catch (error) {
		// Handle any authentication errors gracefully
		// Return null user instead of throwing
		const errorMessage = error instanceof Error ? error.message : String(error)
		if (
			errorMessage.includes("User from sub claim in JWT does not exist") ||
			errorMessage.includes("AuthApiError") ||
			errorMessage.includes("AuthSessionMissingError") ||
			errorMessage.includes("session") ||
			errorMessage.includes("JWT")
		) {
			return {
				user: null,
				session: null,
			}
		}
		// For unexpected errors, log and return null
		console.error("Unexpected error in getSession:", error)
		return {
			user: null,
			session: null,
		}
	}
}

// Sign in user
export async function signIn(email: string, password: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (error) {
			return {
				success: false,
				error: error.message,
				user: null,
			}
		}

		return {
			success: true,
			error: null,
			user: data.user,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to sign in",
			user: null,
		}
	}
}

// Sign up user
export async function signUp(email: string, password: string, name?: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		})

		if (error) {
			return {
				success: false,
				error: error.message,
				user: null,
			}
		}

		// Create profile with name if provided
		if (data.user && name) {
			const { error: profileError } = await supabase.from("profiles").insert({
				user_id: data.user.id,
				name: name,
			})

			if (profileError) {
				console.error("Error creating profile:", profileError)
				// Don't fail the signup if profile creation fails
			}
		}

		return {
			success: true,
			error: null,
			user: data.user,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to sign up",
			user: null,
		}
	}
}

// Sign out user
export async function signOut() {
	try {
		const supabase = await createSupabaseServerClient()
		const { error } = await supabase.auth.signOut()

		if (error) {
			return {
				success: false,
				error: error.message,
			}
		}

		return {
			success: true,
			error: null,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to sign out",
		}
	}
}

// Exchange code for session (email confirmation)
export async function exchangeCodeForSession(code: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			return {
				success: false,
				error: error.message,
				user: null,
			}
		}

		return {
			success: true,
			error: null,
			user: data.user,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to verify email",
			user: null,
		}
	}
}
