"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { DocumentIcon } from "@/components/icons/DocumentIcon"
import { ChecklistIcon } from "@/components/icons/ChecklistIcon"
import { UsersIcon } from "@/components/icons/UsersIcon"
import type { User } from "@supabase/supabase-js"

export default function Home() {
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
		})

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [])

	return (
		<div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			{/* Hero Section */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
						Create & Take Tests
						<span className="block text-blue-600 dark:text-blue-400">
							Made Simple
						</span>
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
						Build interactive quizzes and tests with ease. Share them with
						others and track results in real-time.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						{user ? (
							<>
								<Link href="/dashboard">
									<Button variant="primary" className="text-lg px-8 py-3">
										Go to Dashboard
									</Button>
								</Link>
								<Link href="/create">
									<Button variant="outline" className="text-lg px-8 py-3">
										Create Test
									</Button>
								</Link>
							</>
						) : (
							<>
								<Link href="/auth">
									<Button variant="primary" className="text-lg px-8 py-3">
										Get Started
									</Button>
								</Link>
								<Link href="/auth">
									<Button variant="outline" className="text-lg px-8 py-3">
										Sign In
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
					Everything you need to create amazing tests
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<Card>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<DocumentIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								Easy Test Creation
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Create tests with multiple questions and answers. Add as many
								questions as you need with ease.
							</p>
						</div>
					</Card>

					<Card>
						<div className="text-center">
							<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<ChecklistIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								Instant Results
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Get immediate feedback with detailed results showing correct and
								incorrect answers.
							</p>
						</div>
					</Card>

					<Card>
						<div className="text-center">
							<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<UsersIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								Share & Collaborate
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Share your tests with anyone. Public links make it easy for
								others to take your tests.
							</p>
						</div>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<Card className="bg-linear-to-r from-blue-600 to-purple-600 text-white border-0">
					<div className="text-center py-8">
						<h2 className="text-3xl font-bold mb-4">
							Ready to create your first test?
						</h2>
						<p className="text-xl mb-6 text-blue-100">
							Join thousands of users creating amazing tests every day.
						</p>
						{user ? (
							<Link href="/create">
								<Button
									variant="secondary"
									className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
								>
									Create Your Test
								</Button>
							</Link>
						) : (
							<Link href="/auth">
								<Button
									variant="secondary"
									className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
								>
									Get Started Free
								</Button>
							</Link>
						)}
					</div>
				</Card>
			</section>
		</div>
	)
}
