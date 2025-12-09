"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getUserTests } from "@/lib/actions"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ShareButtons } from "@/components/ShareButtons"
import type { Tables } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"

type Test = Tables<"tests">

export default function DashboardPage() {
	const [user, setUser] = useState<User | null>(null)
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUserAndTests = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setUser(session?.user ?? null)

			if (session?.user) {
				try {
					const result = await getUserTests(session.user.id)

					if (result.success) {
						setTests(result.tests)
					} else {
						console.error("Failed to fetch tests:", result.error)
					}
				} catch (error) {
					console.error("Error fetching tests:", error)
				}
			}
			setLoading(false)
		}

		fetchUserAndTests()
	}, [])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-600 dark:text-gray-400">Loading...</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<h1 className="text-2xl font-bold mb-4">Please sign in</h1>
					<Link href="/auth">
						<Button variant="primary">Sign In</Button>
					</Link>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						My Tests
					</h1>
					<Link href="/create">
						<Button variant="primary">Create New Test</Button>
					</Link>
				</div>

				{tests.length === 0 ? (
					<Card>
						<div className="text-center py-12">
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								You haven't created any tests yet.
							</p>
							<Link href="/create">
								<Button variant="primary">Create Your First Test</Button>
							</Link>
						</div>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{tests.map(test => (
							<Card key={test.id} className="hover:shadow-lg transition-shadow">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									{test.title}
								</h3>
								{test.description && (
									<p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
										{test.description}
									</p>
								)}
								<div className="space-y-2">
									<div className="flex gap-2">
										<Link href={`/create/${test.id}`} className="flex-1">
											<Button variant="outline" className="w-full">
												Edit
											</Button>
										</Link>
										<Link href={`/test/${test.id}`} className="flex-1">
											<Button variant="primary" className="w-full">
												Take Test
											</Button>
										</Link>
									</div>
									<ShareButtons testId={test.id} testTitle={test.title} />
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
