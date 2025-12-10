"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { getTestResult } from "@/lib/actions/tests"
import { ResultsView } from "@/components/ResultsView"
import { Container, Card, Title, Stack, Loader, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
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
	const params = useParams<{ id: string }>()
	const resultId = params.id
	const { t } = useTranslation()

	const [result, setResult] = useState<TestResult | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchResult = async () => {
			try {
				const result = await getTestResult(resultId)

				if (!result.success || !result.result) {
					throw new Error(result.error || t("resultsPage.notFound"))
				}

				setResult(result.result as TestResult)
			} catch (err) {
				console.error("Error fetching result:", err)
				setError(err instanceof Error ? err.message : t("resultsPage.notFound"))
			} finally {
				setLoading(false)
			}
		}

		fetchResult()
	}, [resultId])

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

	if (error || !result) {
		return (
			<Container
				size="sm"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Title order={2}>Error</Title>
						<Alert icon={<IconAlertCircle size={16} />} title={t("resultsPage.error")} color="red">
							{error || t("resultsPage.notFound")}
						</Alert>
					</Stack>
				</Card>
			</Container>
		)
	}

	return (
		<Container size="xl" py="xl">
			<ResultsView result={result} showCorrectAnswers={true} />
		</Container>
	)
}
