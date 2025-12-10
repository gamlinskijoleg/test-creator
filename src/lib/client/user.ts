import { supabaseClient } from "../supabase-client"

const PAGE_SIZE = 12

// Get all tests with pagination (client-side version)
export async function getAllTestsPaginatedClient(page: number = 1, pageSize: number = PAGE_SIZE) {
	try {
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1

		const {
			data: tests,
			error,
			count,
		} = await supabaseClient
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
