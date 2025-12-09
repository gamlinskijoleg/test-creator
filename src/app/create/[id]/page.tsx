"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getTest, saveTestQuestions } from "@/lib/actions"
import { TestBuilder } from "@/components/TestBuilder"
import { Card } from "@/components/ui/Card"
import { ShareButtons } from "@/components/ShareButtons"
import type { Tables } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

export default function EditTestPage() {
	const params = useParams()
	const router = useRouter()
	const testId = params.id as string

	const [user, setUser] = useState<User | null>(null)
	const [test, setTest] = useState<Tables<"tests"> | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setUser(session?.user ?? null)

			if (!session?.user) {
				setLoading(false)
				return
			}

			try {
				const result = await getTest(testId)

				if (!result.success || !result.test) {
					throw new Error(result.error || "Failed to load test")
				}

				setTest(result.test)
				setQuestions(result.questions)
			} catch (err) {
				console.error("Error fetching test:", err)
				setError(err instanceof Error ? err.message : "Failed to load test")
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [testId])

	const handleSave = async (updatedQuestions: Question[]) => {
		try {
			const result = await saveTestQuestions(testId, updatedQuestions)

			if (!result.success) {
				throw new Error(result.error || "Failed to save test")
			}

			// Update local state
			setQuestions(updatedQuestions)
			alert("Test saved successfully!")
		} catch (err) {
			console.error("Error saving test:", err)
			alert(
				err instanceof Error
					? `Failed to save test: ${err.message}`
					: "Failed to save test. Please try again.",
			)
			throw err
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-600 dark:text-gray-400">Loading...</div>
			</div>
		)
	}

	if (error || !test) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<h1 className="text-2xl font-bold mb-4">Error</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						{error || "Test not found"}
					</p>
				</Card>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<h1 className="text-2xl font-bold mb-4">Please sign in</h1>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<button
						onClick={() => router.back()}
						className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
					>
						← Back
					</button>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								{test.title}
							</h1>
							{test.description && (
								<p className="text-gray-600 dark:text-gray-400 mt-2">
									{test.description}
								</p>
							)}
						</div>
						<ShareButtons testId={testId} testTitle={test.title} />
					</div>
				</div>

				<TestBuilder
					testId={testId}
					initialQuestions={questions}
					onSave={handleSave}
				/>
			</div>
		</div>
	)
}
