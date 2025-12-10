"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useUser } from "@/lib/hooks/useUser"
import { getTest, submitTest } from "@/lib/actions/tests"
import { TestRunner } from "@/components/TestRunner"
import { Container, Card, Title, Stack, Loader, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import type { Tables } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

type Test = Tables<"tests">

export default function TakeTestPage() {
	const params = useParams<{ id: string }>()
	const testId = params.id
	const { user } = useUser()
	const { t } = useTranslation()

	const [test, setTest] = useState<Test | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [authorProfile, setAuthorProfile] = useState<{ name: string | null; surname: string | null } | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const result = await getTest(testId)

				if (!result.success || !result.test) {
					throw new Error(result.error || t("takeTest.notFound"))
				}

				setTest(result.test)
				setAuthorProfile(result.authorProfile || null)
				// Filter out correct answers for the test taker
				const questionsWithoutCorrectAnswers = (result.questions || []).map((q: Question) => ({
					...q,
					answers: q.answers?.map(a => {
						const answer = { ...a }
						delete (answer as { is_correct?: boolean | null }).is_correct
						return answer
					}),
				}))
				setQuestions(questionsWithoutCorrectAnswers)
			} catch (err) {
				console.error("Error fetching test:", err)
				setError(err instanceof Error ? err.message : t("takeTest.notFound"))
			} finally {
				setLoading(false)
			}
		}

		fetchTest()
	}, [testId])

	const handleSubmit = async (answers: Record<string, string>) => {
		const userId = user?.id || null

		const result = await submitTest(testId, answers, userId)

		if (!result.success || !result.resultId) {
			throw new Error(result.error || "Failed to submit test")
		}

		return { resultId: result.resultId }
	}

	if (loading) {
		return (
			<Container
				size="xl"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Loader />
			</Container>
		)
	}

	if (error || !test) {
		return (
			<Container
				size="sm"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Title order={2}>Error</Title>
						<Alert icon={<IconAlertCircle size={16} />} title={t("takeTest.error")} color="red">
							{error || t("takeTest.notFound")}
						</Alert>
					</Stack>
				</Card>
			</Container>
		)
	}

	return (
		<Container size="xl" py="xl">
			<TestRunner test={test} questions={questions} onSubmit={handleSubmit} authorProfile={authorProfile} />
		</Container>
	)
}
