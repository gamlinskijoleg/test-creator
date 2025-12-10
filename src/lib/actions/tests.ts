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

// Delete a test and all related data (questions, answers, results)
export async function deleteTest(testId: string, userId: string) {
	try {
		const supabase = await createSupabaseServerClient()

		// Ensure test exists and belongs to the current user
		const { data: test, error: testError } = await supabase
			.from("tests")
			.select("id, author_id")
			.eq("id", testId)
			.single()

		if (testError || !test) {
			return {
				success: false,
				error: testError?.message || "Test not found",
			}
		}

		if (test.author_id !== userId) {
			return {
				success: false,
				error: "Unauthorized",
			}
		}

		// Collect related question and result ids
		const { data: questionRows, error: questionsError } = await supabase
			.from("questions")
			.select("id")
			.eq("test_id", testId)
		if (questionsError) {
			return { success: false, error: questionsError.message }
		}
		const questionIds = (questionRows ?? []).map(q => q.id).filter(Boolean)

		const { data: resultRows, error: resultsError } = await supabase
			.from("test_results")
			.select("id")
			.eq("test_id", testId)
		if (resultsError) {
			return { success: false, error: resultsError.message }
		}
		const resultIds = (resultRows ?? []).map(r => r.id).filter(Boolean)

		// Delete given answers tied to this test (by questions and by results)
		if (questionIds.length > 0) {
			const { error } = await supabase.from("given_answers").delete().in("question_id", questionIds)
			if (error) {
				return { success: false, error: error.message }
			}
		}

		if (resultIds.length > 0) {
			const { error } = await supabase.from("given_answers").delete().in("result_id", resultIds)
			if (error) {
				return { success: false, error: error.message }
			}
		}

		// Delete answers and questions
		if (questionIds.length > 0) {
			const { error: answersError } = await supabase.from("answers").delete().in("question_id", questionIds)
			if (answersError) {
				return { success: false, error: answersError.message }
			}

			const { error: deleteQuestionsError } = await supabase.from("questions").delete().eq("test_id", testId)
			if (deleteQuestionsError) {
				return { success: false, error: deleteQuestionsError.message }
			}
		}

		// Delete results
		const { error: deleteResultsError } = await supabase.from("test_results").delete().eq("test_id", testId)
		if (deleteResultsError) {
			return { success: false, error: deleteResultsError.message }
		}

		// Finally delete the test itself
		const { error: deleteTestError } = await supabase.from("tests").delete().eq("id", testId)
		if (deleteTestError) {
			return { success: false, error: deleteTestError.message }
		}

		return { success: true, error: null }
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete test",
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

type TestResultWithProfile = Tables<"test_results"> & {
	profile?: {
		name: string | null
		surname: string | null
	} | null
}

// Get all attempts for a test (only for the author)
export async function getTestResultsForOwner(testId: string, ownerId: string) {
	try {
		const supabase = await createSupabaseServerClient()

		// Ensure test belongs to the owner
		const { data: test, error: testError } = await supabase.from("tests").select("*").eq("id", testId).single()
		if (testError || !test) {
			return {
				success: false,
				error: testError?.message || "Test not found",
				results: [],
				questionCount: 0,
				test: null,
			}
		}

		if (test.author_id !== ownerId) {
			return { success: false, error: "Unauthorized", results: [], questionCount: 0, test: null }
		}

		// Count questions to compute percentages
		const { count: questionCount = 0 } = await supabase
			.from("questions")
			.select("id", { count: "exact", head: true })
			.eq("test_id", testId)

		const normalizedQuestionCount = questionCount ?? 0

		const { data: results, error: resultsError } = await supabase
			.from("test_results")
			.select("id, score, taken_at, user_id, test_id")
			.eq("test_id", testId)
			.order("taken_at", { ascending: false })

		if (resultsError) {
			return { success: false, error: resultsError.message, results: [], questionCount: normalizedQuestionCount, test }
		}

		const userIds = Array.from(new Set((results || []).map(r => r.user_id).filter(Boolean))) as string[]
		let profilesMap: Record<string, { name: string | null; surname: string | null }> = {}

		if (userIds.length > 0) {
			const { data: profiles } = await supabase.from("profiles").select("user_id, name, surname").in("user_id", userIds)

			if (profiles) {
				profilesMap = profiles.reduce(
					(acc, profile) => ({ ...acc, [profile.user_id]: { name: profile.name, surname: profile.surname } }),
					{},
				)
			}
		}

		const enrichedResults: TestResultWithProfile[] =
			results?.map(r => ({
				...r,
				profile: r.user_id ? (profilesMap[r.user_id] ?? null) : null,
			})) ?? []

		return {
			success: true,
			error: null,
			results: enrichedResults,
			questionCount: normalizedQuestionCount,
			test,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to fetch results",
			results: [],
			questionCount: 0,
			test: null,
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
