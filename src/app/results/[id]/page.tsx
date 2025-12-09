"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getTestResult } from "@/lib/actions"
import { ResultsView } from "@/components/ResultsView"
import { Card } from "@/components/ui/Card"
import type { Tables } from "@/types/supabase"

type TestResult = Tables<"test_results"> & {
	test: Tables<"tests">
	given_answers?: (Tables<"given_answers"> & {
		question: Tables<"questions"> & {
			answers?: Tables<"answers">[]
		}
		answer?: Tables<"answers"> | null
	})[]
}

export default function ResultsPage() {
	const params = useParams()
	const resultId = params.id as string

	const [result, setResult] = useState<TestResult | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchResult = async () => {
			try {
				const result = await getTestResult(resultId)

				if (!result.success || !result.result) {
					throw new Error(result.error || "Failed to load results")
				}

				setResult(result.result as TestResult)
			} catch (err) {
				console.error("Error fetching result:", err)
				setError(err instanceof Error ? err.message : "Failed to load results")
			} finally {
				setLoading(false)
			}
		}

		fetchResult()
	}, [resultId])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-600 dark:text-gray-400">Loading...</div>
			</div>
		)
	}

	if (error || !result) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<h1 className="text-2xl font-bold mb-4">Error</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{error || "Results not found"}
					</p>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<ResultsView result={result} showCorrectAnswers={true} />
			</div>
		</div>
	)
}
