"use server"

import { createSupabaseServerClient } from "../supabase-server"
import type { Tables } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

// Create a new test
export async function createTest(title: string, description: string | null, authorId: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data: testData, error: supabaseError } = await supabase
			.from("tests")
			.insert({
				title,
				description,
				author_id: authorId,
			})
			.select()
			.single()

		if (supabaseError || !testData) {
			return {
				success: false,
				error: supabaseError?.message || "Failed to create test",
				test: null,
			}
		}

		return {
			success: true,
			error: null,
			test: testData,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create test",
			test: null,
		}
	}
}

// Get test with questions and answers
export async function getTest(testId: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data: test, error: testError } = await supabase.from("tests").select("*").eq("id", testId).single()

		if (testError || !test) {
			return {
				success: false,
				error: testError?.message || "Test not found",
				test: null,
				questions: [],
				authorProfile: null,
			}
		}

		// Get author profile
		let authorProfile = null
		if (test.author_id) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("name, surname")
				.eq("user_id", test.author_id)
				.single()
			authorProfile = profile
		}

		const { data: questions, error: questionsError } = await supabase
			.from("questions")
			.select("*, answers(*)")
			.eq("test_id", testId)
			.order("order_index", { ascending: true })

		if (questionsError) {
			return {
				success: false,
				error: questionsError.message,
				test,
				questions: [],
				authorProfile,
			}
		}

		return {
			success: true,
			error: null,
			test,
			questions: questions || [],
			authorProfile,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch test",
			test: null,
			questions: [],
			authorProfile: null,
		}
	}
}

// Save test questions and answers
export async function saveTestQuestions(testId: string, questions: Question[]) {
	try {
		const supabase = await createSupabaseServerClient()
		// Get existing questions
		const { data: existingQuestions } = await supabase.from("questions").select("id").eq("test_id", testId)

		// Delete existing answers and questions
		if (existingQuestions && existingQuestions.length > 0) {
			const questionIds = existingQuestions.map(q => q.id)
			await supabase.from("answers").delete().in("question_id", questionIds)
			await supabase.from("questions").delete().eq("test_id", testId)
		}

		// Insert new questions and answers
		for (let i = 0; i < questions.length; i++) {
			const question = questions[i]
			const { data: newQuestion, error: qError } = await supabase
				.from("questions")
				.insert({
					question_text: question.question_text,
					test_id: testId,
					order_index: i,
				})
				.select()
				.single()

			if (qError || !newQuestion) {
				return {
					success: false,
					error: `Failed to save question: ${qError?.message}`,
				}
			}

			if (question.answers && question.answers.length > 0) {
				const answersToInsert = question.answers.map(answer => ({
					answer_text: answer.answer_text,
					is_correct: answer.is_correct ?? false,
					question_id: newQuestion.id,
				}))

				const { error: aError } = await supabase.from("answers").insert(answersToInsert)

				if (aError) {
					return {
						success: false,
						error: `Failed to save answers: ${aError.message}`,
					}
				}
			}
		}

		return {
			success: true,
			error: null,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to save test",
		}
	}
}

// Submit test answers
export async function submitTest(testId: string, answers: Record<string, string>, userId: string | null) {
	try {
		const supabase = await createSupabaseServerClient()
		// Get test questions to calculate score
		const { data: questions, error: questionsError } = await supabase
			.from("questions")
			.select("*, answers(*)")
			.eq("test_id", testId)

		if (questionsError || !questions) {
			return {
				success: false,
				error: "Failed to fetch test questions",
				resultId: null,
			}
		}

		// Calculate score
		let correctAnswers = 0
		const givenAnswers: Array<{
			question_id: string
			answer_id: string
		}> = []

		for (const question of questions as Question[]) {
			const selectedAnswerId = answers[question.id]
			if (!selectedAnswerId) continue

			const selectedAnswer = question.answers?.find(a => a.id === selectedAnswerId)
			if (selectedAnswer?.is_correct) {
				correctAnswers++
			}

			givenAnswers.push({
				question_id: question.id,
				answer_id: selectedAnswerId,
			})
		}

		const totalQuestions = questions.length
		const score = totalQuestions > 0 ? correctAnswers : 0

		// Create test result
		const { data: result, error: resultError } = await supabase
			.from("test_results")
			.insert({
				test_id: testId,
				user_id: userId,
				score,
				taken_at: new Date().toISOString(),
			})
			.select()
			.single()

		if (resultError || !result) {
			return {
				success: false,
				error: resultError?.message || "Failed to create test result",
				resultId: null,
			}
		}

		// Create given answers
		if (givenAnswers.length > 0) {
			const givenAnswersToInsert = givenAnswers.map(ga => ({
				result_id: result.id,
				question_id: ga.question_id,
				answer_id: ga.answer_id,
			}))

			const { error: givenAnswersError } = await supabase.from("given_answers").insert(givenAnswersToInsert)

			if (givenAnswersError) {
				console.error("Failed to save given answers:", givenAnswersError)
				// Don't fail the whole operation if given answers fail
			}
		}

		return {
			success: true,
			error: null,
			resultId: result.id,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to submit test",
			resultId: null,
		}
	}
}

// Get test result with details
export async function getTestResult(resultId: string) {
	try {
		const supabase = await createSupabaseServerClient()
		const { data: result, error: resultError } = await supabase
			.from("test_results")
			.select("*, test:tests(*)")
			.eq("id", resultId)
			.single()

		if (resultError || !result) {
			return {
				success: false,
				error: resultError?.message || "Result not found",
				result: null,
			}
		}

		// Get given answers with questions and answers
		const { data: givenAnswers, error: givenAnswersError } = await supabase
			.from("given_answers")
			.select("*, question:questions(*, answers(*)), answer:answers(*)")
			.eq("result_id", resultId)

		if (givenAnswersError) {
			return {
				success: false,
				error: givenAnswersError.message,
				result: null,
			}
		}

		return {
			success: true,
			error: null,
			result: {
				...result,
				given_answers: givenAnswers || [],
			},
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch result",
			result: null,
		}
	}
}
