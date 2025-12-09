"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "./ui/Button"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [])

	const handleSignOut = async () => {
		await supabase.auth.signOut()
	}

	return (
		<nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Link
							href="/"
							className="text-xl font-bold text-gray-900 dark:text-white"
						>
							Test Creator
						</Link>
						{user && (
							<>
								<Link
									href="/dashboard"
									className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
								>
									Dashboard
								</Link>
								<Link
									href="/create"
									className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
								>
									Create Test
								</Link>
							</>
						)}
					</div>
					<div className="flex items-center space-x-4">
						{loading ? (
							<div className="text-gray-500">Loading...</div>
						) : user ? (
							<>
								<span className="text-sm text-gray-600 dark:text-gray-300">
									{user.email}
								</span>
								<Button variant="outline" onClick={handleSignOut}>
									Sign Out
								</Button>
							</>
						) : (
							<Link href="/auth">
								<Button variant="primary">Sign In</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
