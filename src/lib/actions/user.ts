"use server"

import { createSupabaseServerClient } from "../supabase-server"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase"

const PAGE_SIZE = 12

type Profile = Tables<"profiles">
type ProfileUpdate = TablesUpdate<"profiles">

// Get user's tests
export async function getUserTests(userId: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data: tests, error } = await supabase
			.from("tests")
			.select("*")
			.eq("author_id", userId)
			.order("created_at", { ascending: false })

		if (error) {
			return {
				success: false,
				error: error.message,
				tests: [],
			}
		}

		return {
			success: true,
			error: null,
			tests: tests || [],
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch tests",
			tests: [],
		}
	}
}

// Get user's tests with pagination
export async function getUserTestsPaginated(userId: string, page: number = 1, pageSize: number = PAGE_SIZE) {
	try {
		const supabase = await createSupabaseServerClient()
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1

		const {
			data: tests,
			error,
			count,
		} = await supabase
			.from("tests")
			.select("*", { count: "exact" })
			.eq("author_id", userId)
			.order("created_at", { ascending: false })
			.range(from, to)

		if (error) {
			return {
				success: false,
				error: error.message,
				tests: [],
				hasMore: false,
			}
		}

		const totalTests = count || 0
		const hasMore = to < totalTests - 1

		return {
			success: true,
			error: null,
			tests: tests || [],
			hasMore,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch tests",
			tests: [],
			hasMore: false,
		}
	}
}

// Get all tests with pagination (for public viewing)
export async function getAllTestsPaginated(page: number = 1, pageSize: number = PAGE_SIZE) {
	try {
		const supabase = await createSupabaseServerClient()
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1

		const {
			data: tests,
			error,
			count,
		} = await supabase
			.from("tests")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(from, to)

		if (error) {
			return {
				success: false,
				error: error.message,
				tests: [],
				hasMore: false,
			}
		}

		const totalTests = count || 0
		const hasMore = to < totalTests - 1

		return {
			success: true,
			error: null,
			tests: tests || [],
			hasMore,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch tests",
			tests: [],
			hasMore: false,
		}
	}
}

// Get user profile
export async function getUserProfile(userId: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

		if (error) {
			// Profile doesn't exist yet, return null
			if (error.code === "PGRST116") {
				return {
					success: true,
					error: null,
					profile: null,
				}
			}
			return {
				success: false,
				error: error.message,
				profile: null,
			}
		}

		return {
			success: true,
			error: null,
			profile: profile as Profile,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch profile",
			profile: null,
		}
	}
}

// Create or update user profile
export async function upsertUserProfile(userId: string, profileData: ProfileUpdate) {
	try {
		const supabase = await createSupabaseServerClient()

		// Check if profile exists
		const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", userId).single()

		if (existingProfile) {
			// Update existing profile
			const { data: profile, error } = await supabase
				.from("profiles")
				.update({
					...profileData,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.select()
				.single()

			if (error) {
				return {
					success: false,
					error: error.message,
					profile: null,
				}
			}

			return {
				success: true,
				error: null,
				profile: profile as Profile,
			}
		} else {
			// Create new profile
			const { data: profile, error } = await supabase
				.from("profiles")
				.insert({
					user_id: userId,
					...profileData,
				})
				.select()
				.single()

			if (error) {
				return {
					success: false,
					error: error.message,
					profile: null,
				}
			}

			return {
				success: true,
				error: null,
				profile: profile as Profile,
			}
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save profile",
			profile: null,
		}
	}
}
