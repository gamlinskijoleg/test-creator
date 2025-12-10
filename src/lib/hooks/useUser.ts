"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/lib/actions/auth"
import type { User } from "@supabase/supabase-js"

interface UseUserOptions {
	/**
	 * Enable polling to periodically check for session changes
	 * @default false
	 */
	polling?: boolean
	/**
	 * Polling interval in milliseconds
	 * @default 5000
	 */
	pollingInterval?: number
}

interface UseUserReturn {
	user: User | null
	loading: boolean
	/**
	 * Manually refresh the user session
	 */
	refresh: () => Promise<void>
}

/**
 * Standardized hook for fetching and managing user authentication state
 */
export function useUser(options: UseUserOptions = {}): UseUserReturn {
	const { polling = false, pollingInterval = 5000 } = options

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchUser = async () => {
		try {
			const { user } = await getSession()
			setUser(user)
		} catch (error) {
			console.error("Error fetching user:", error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		let mounted = true

		const initFetch = async () => {
			await fetchUser()
		}

		initFetch()

		if (!polling) {
			return
		}

		// Poll for session changes periodically
		const interval = setInterval(() => {
			if (mounted) {
				fetchUser()
			}
		}, pollingInterval)

		return () => {
			mounted = false
			clearInterval(interval)
		}
	}, [polling, pollingInterval])

	const refresh = async () => {
		await fetchUser()
	}

	return {
		user,
		loading,
		refresh,
	}
}
