"use server"

import { createSupabaseServerClient, getServerSession } from "../supabase-server"

// Get current session
export async function getSession() {
	const session = await getServerSession()
	return {
		user: session?.user ?? null,
		session: session ? { user: session.user } : null,
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
