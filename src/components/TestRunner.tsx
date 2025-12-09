"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import { Card } from "./ui/Card"
import type { Tables } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

interface TestRunnerProps {
	test: {
		id: string
		title: string
		description?: string | null
	}
	questions: Question[]
	onSubmit: (answers: Record<string, string>) => Promise<{ resultId: string }>
}

export function TestRunner({ test, questions, onSubmit }: TestRunnerProps) {
	const [selectedAnswers, setSelectedAnswers] = useState<
		Record<string, string>
	>({})
	const [submitting, setSubmitting] = useState(false)

	const handleAnswerSelect = (questionId: string, answerId: string) => {
		setSelectedAnswers({ ...selectedAnswers, [questionId]: answerId })
	}

	const handleSubmit = async () => {
		setSubmitting(true)
		try {
			const result = await onSubmit(selectedAnswers)
			window.location.href = `/results/${result.resultId}`
		} catch (error) {
			console.error("Failed to submit test:", error)
			alert("Failed to submit test. Please try again.")
		} finally {
			setSubmitting(false)
		}
	}

	const allQuestionsAnswered = questions.every(
		q => selectedAnswers[q.id] !== undefined,
	)

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Card>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					{test.title}
				</h1>
				{test.description && (
					<p className="text-gray-600 dark:text-gray-300">{test.description}</p>
				)}
			</Card>

			<div className="space-y-6">
				{questions.map((question, index) => (
					<Card key={question.id}>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
							Question {index + 1}: {question.question_text}
						</h3>
						<div className="space-y-2">
							{question.answers?.map(answer => (
								<label
									key={answer.id}
									className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
										selectedAnswers[question.id] === answer.id
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
											: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
									}`}
								>
									<input
										type="radio"
										name={`question-${question.id}`}
										value={answer.id}
										checked={selectedAnswers[question.id] === answer.id}
										onChange={() => handleAnswerSelect(question.id, answer.id)}
										className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-gray-700 dark:text-gray-300">
										{answer.answer_text}
									</span>
								</label>
							))}
						</div>
					</Card>
				))}
			</div>

			<div className="flex justify-end">
				<Button
					variant="primary"
					onClick={handleSubmit}
					disabled={!allQuestionsAnswered || submitting}
				>
					{submitting ? "Submitting..." : "Submit Test"}
				</Button>
			</div>

			{!allQuestionsAnswered && (
				<p className="text-sm text-amber-600 dark:text-amber-400 text-center">
					Please answer all questions before submitting.
				</p>
			)}
		</div>
	)
}
