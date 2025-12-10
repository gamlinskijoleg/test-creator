"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Container, Card, Title, Stack, Group, Button, Loader, Alert, Text, Table, Badge } from "@mantine/core"
import { IconArrowLeft, IconExternalLink, IconChartBar, IconUser } from "@tabler/icons-react"
import { useUser } from "@/lib/hooks/useUser"
import { getTestResultsForOwner } from "@/lib/actions/tests"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"
import type { Tables } from "@/types/supabase"

type OwnerResult = Awaited<ReturnType<typeof getTestResultsForOwner>>["results"][number]
type Test = Tables<"tests">

export default function TestResultsHistoryPage() {
	const params = useParams<{ id: string }>()
	const testId = params.id
	const { user, loading: userLoading } = useUser()
	const { t } = useTranslation()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [results, setResults] = useState<OwnerResult[]>([])
	const [test, setTest] = useState<Test | null>(null)
	const [questionCount, setQuestionCount] = useState(0)

	useEffect(() => {
		const fetchHistory = async () => {
			if (!user) {
				setLoading(false)
				return
			}

			try {
				const response = await getTestResultsForOwner(testId, user.id)
				if (!response.success || !response.test) {
					setError(response.error || t("errors.resultsNotFound"))
					setResults([])
					return
				}

				setResults(response.results)
				setTest(response.test)
				setQuestionCount(response.questionCount ?? 0)
			} catch (err) {
				console.error("Error loading test history:", err)
				setError(err instanceof Error ? err.message : t("errors.resultsNotFound"))
			} finally {
				setLoading(false)
			}
		}

		if (!userLoading) {
			fetchHistory()
		}
	}, [testId, user, userLoading, t])

	const rows = useMemo(() => {
		return results.map(result => {
			const takenAt = result.taken_at ? new Date(result.taken_at).toLocaleString() : "—"
			const fullName =
				result.profile && (result.profile.name || result.profile.surname)
					? [result.profile.name, result.profile.surname].filter(Boolean).join(" ")
					: t("resultsHistory.anonymous")

			const percent = questionCount > 0 ? ((result.score || 0) / questionCount) * 100 : null

			return (
				<Table.Tr key={result.id}>
					<Table.Td>
						<Group gap="xs">
							<IconUser size={16} />
							<Text fw={500}>{fullName}</Text>
						</Group>
					</Table.Td>
					<Table.Td>
						<Stack gap={2}>
							<Group gap={8}>
								<Badge color="teal" variant="light">
									{t("resultsHistory.scoreValue", { score: result.score ?? 0, total: questionCount })}
								</Badge>
								{percent !== null && (
									<Badge color={percent >= 70 ? "teal" : "yellow"} variant="outline">
										{percent.toFixed(1)}%
									</Badge>
								)}
							</Group>
							<Text size="xs" c="dimmed">
								{t("results.total")}: {questionCount}
							</Text>
						</Stack>
					</Table.Td>
					<Table.Td>
						<Text size="sm">{takenAt}</Text>
					</Table.Td>
					<Table.Td>
						<Button
							component={Link}
							href={`/results/${result.id}`}
							variant="light"
							size="xs"
							leftSection={<IconExternalLink size={14} />}
						>
							{t("resultsHistory.view")}
						</Button>
					</Table.Td>
				</Table.Tr>
			)
		})
	}, [results, questionCount, t])

	if (loading || userLoading) {
		return (
			<Container
				size="lg"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Loader />
			</Container>
		)
	}

	if (!user) {
		return <UnauthenticatedMessage />
	}

	return (
		<Container size="lg" py="xl">
			<Stack gap="lg">
				<Group justify="space-between" align="center">
					<Stack gap={4}>
						<Group gap="xs">
							<IconChartBar size={22} />
							<Title order={2}>{t("resultsHistory.title")}</Title>
						</Group>
						<Text c="dimmed" size="sm">
							{test ? t("resultsHistory.subtitle", { title: test.title }) : t("resultsHistory.subtitleFallback")}
						</Text>
					</Stack>
					<Button component={Link} href="/dashboard" variant="subtle" leftSection={<IconArrowLeft size={16} />}>
						{t("resultsHistory.back")}
					</Button>
				</Group>

				{error && (
					<Alert color="red" title={t("errors.title")} variant="light">
						{error}
					</Alert>
				)}

				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<Title order={4}>{t("resultsHistory.tableTitle")}</Title>
							<Text size="sm" c="dimmed">
								{t("resultsHistory.totalAttempts", { count: results.length })}
							</Text>
						</Group>

						{results.length === 0 ? (
							<Text c="dimmed">{t("resultsHistory.empty")}</Text>
						) : (
							<Table highlightOnHover>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>{t("resultsHistory.participant")}</Table.Th>
										<Table.Th>{t("resultsHistory.score")}</Table.Th>
										<Table.Th>{t("resultsHistory.takenAt")}</Table.Th>
										<Table.Th />
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>{rows}</Table.Tbody>
							</Table>
						)}
					</Stack>
				</Card>
			</Stack>
		</Container>
	)
}
