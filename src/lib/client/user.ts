import { supabaseClient } from "../supabase-client"
import type { Tables } from "@/types/supabase"

const PAGE_SIZE = 12

type AuthorFilter = "all" | "mine" | "others"

type TestWithAuthor = Tables<"tests"> & {
	authorProfile: {
		name: string | null
		surname: string | null
	} | null
}

// Get all tests with pagination (client-side version)
export async function getAllTestsPaginatedClient(
	page: number = 1,
	pageSize: number = PAGE_SIZE,
	options?: { search?: string; authorFilter?: AuthorFilter; userId?: string },
) {
	try {
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1
		const search = options?.search?.trim()
		const authorFilter = options?.authorFilter || "all"
		const userId = options?.userId

		// Fetch only needed columns; avoid expensive exact count
		let query = supabaseClient.from("tests").select("id,title,description,author_id,created_at", { count: "planned" })

		if (search && search.length > 0) {
			const pattern = `%${search}%`
			query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`)
		}

		if (authorFilter === "mine" && userId) {
			query = query.eq("author_id", userId)
		} else if (authorFilter === "others" && userId) {
			query = query.neq("author_id", userId)
		}

		const { data: tests, error } = await query.order("created_at", { ascending: false }).range(from, to)

		if (error) {
			return {
				success: false,
				error: error.message,
				tests: [],
				hasMore: false,
			}
		}

		// Get author profiles for all tests
		const authorIds = tests?.map(test => test.author_id).filter(Boolean) as string[]
		const testsWithAuthors: TestWithAuthor[] = []

		if (authorIds.length > 0) {
			const { data: profiles } = await supabaseClient
				.from("profiles")
				.select("user_id, name, surname")
				.in("user_id", authorIds)

			const profilesMap = new Map(
				profiles?.map(profile => [profile.user_id, { name: profile.name, surname: profile.surname }]) || [],
			)

			testsWithAuthors.push(
				...(tests || []).map(test => ({
					...test,
					authorProfile: test.author_id ? profilesMap.get(test.author_id) || null : null,
				})),
			)
		} else {
			testsWithAuthors.push(...(tests || []).map(test => ({ ...test, authorProfile: null })))
		}

		const hasMore = (tests?.length || 0) === pageSize

		return {
			success: true,
			error: null,
			tests: testsWithAuthors,
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
