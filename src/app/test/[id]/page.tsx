"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getTest, submitTest } from "@/lib/actions"
import { TestRunner } from "@/components/TestRunner"
import { Card } from "@/components/ui/Card"
import type { Tables } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

type Test = Tables<"tests">

export default function TakeTestPage() {
	const params = useParams()
	const testId = params.id as string

	const [test, setTest] = useState<Test | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const result = await getTest(testId)

				if (!result.success || !result.test) {
					throw new Error(result.error || "Failed to load test")
				}

				setTest(result.test)
				// Filter out correct answers for the test taker
				const questionsWithoutCorrectAnswers = (result.questions || []).map(
					(q: Question) => ({
						...q,
						answers: q.answers?.map(a => {
							const answer = { ...a }
							delete (answer as { is_correct?: boolean | null }).is_correct
							return answer
						}),
					}),
				) as Question[]
				setQuestions(questionsWithoutCorrectAnswers)
			} catch (err) {
				console.error("Error fetching test:", err)
				setError(err instanceof Error ? err.message : "Failed to load test")
			} finally {
				setLoading(false)
			}
		}

		fetchTest()
	}, [testId])

	const handleSubmit = async (answers: Record<string, string>) => {
		const {
			data: { session },
		} = await supabase.auth.getSession()
		const userId = session?.user?.id || null

		const result = await submitTest(testId, answers, userId)

		if (!result.success || !result.resultId) {
			throw new Error(result.error || "Failed to submit test")
		}

		return { resultId: result.resultId }
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
					<p className="text-gray-600 dark:text-gray-400">
						{error || "Test not found"}
					</p>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<TestRunner test={test} questions={questions} onSubmit={handleSubmit} />
			</div>
		</div>
	)
}
