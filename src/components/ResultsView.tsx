"use client"

import { Card } from "./ui/Card"
import type { Tables } from "@/types/supabase"

type TestResult = Tables<"test_results">
type GivenAnswer = Tables<"given_answers">
type Question = Tables<"questions">
type Answer = Tables<"answers">

interface ResultsViewProps {
	result: TestResult & {
		test: {
			id: string
			title: string
			description?: string | null
		}
		given_answers?: (GivenAnswer & {
			question: Question & {
				answers?: Answer[]
			}
			answer?: Answer | null
		})[]
	}
	showCorrectAnswers?: boolean
}

export function ResultsView({
	result,
	showCorrectAnswers = true,
}: ResultsViewProps) {
	const totalQuestions = result.given_answers?.length ?? 0
	const score = result.score ?? 0
	const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Card>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Test Results
				</h1>
				<h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">
					{result.test.title}
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
							{score}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Correct
						</div>
					</div>
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
						<div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
							{totalQuestions}
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Total
						</div>
					</div>
					<div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
						<div className="text-3xl font-bold text-green-600 dark:text-green-400">
							{percentage.toFixed(1)}%
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Score
						</div>
					</div>
				</div>
			</Card>

			{showCorrectAnswers && result.given_answers && (
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
						Your Answers
					</h3>
					{result.given_answers.map((givenAnswer, index) => {
						const question = givenAnswer.question
						const selectedAnswer = givenAnswer.answer
						const correctAnswer = question.answers?.find(a => a.is_correct)

						const isCorrect = selectedAnswer?.is_correct ?? false

						return (
							<Card key={givenAnswer.id}>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h4 className="text-lg font-medium text-gray-900 dark:text-white">
											Question {index + 1}: {question.question_text}
										</h4>
										{isCorrect ? (
											<span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
												Correct
											</span>
										) : (
											<span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium">
												Incorrect
											</span>
										)}
									</div>

									<div className="space-y-2">
										<div>
											<p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
												Your answer:
											</p>
											<p
												className={`p-2 rounded ${
													isCorrect
														? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300"
														: "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300"
												}`}
											>
												{selectedAnswer?.answer_text ?? "No answer selected"}
											</p>
										</div>

										{!isCorrect && correctAnswer && (
											<div>
												<p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
													Correct answer:
												</p>
												<p className="p-2 rounded bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300">
													{correctAnswer.answer_text}
												</p>
											</div>
										)}
									</div>
								</div>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}
