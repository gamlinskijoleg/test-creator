"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Card, Title, Text, Stack, Radio, Group, Alert, Container } from "@mantine/core"
import { IconAlertCircle, IconSend } from "@tabler/icons-react"
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
	authorProfile?: { name: string | null; surname: string | null } | null
}

export function TestRunner({ test, questions, onSubmit, authorProfile }: TestRunnerProps) {
	const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
	const [submitting, setSubmitting] = useState(false)
	const { t } = useTranslation()

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
			alert(t("editTest.saveFailed"))
		} finally {
			setSubmitting(false)
		}
	}

	const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id] !== undefined)

	return (
		<Container size="md">
			<Stack gap="lg">
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="xs">
						<Title order={1}>{test.title}</Title>
						{test.description && <Text c="dimmed">{test.description}</Text>}
					</Stack>
				</Card>

				<Stack gap="lg">
					{questions.map((question, index) => {
						const authorName = authorProfile?.name
							? `${authorProfile.name}${authorProfile.surname ? ` ${authorProfile.surname}` : ""}`
							: null

						return (
							<Card key={question.id} shadow="sm" padding="lg" radius="md" withBorder>
								<Stack gap="md">
									<Group justify="space-between" align="flex-start">
										<Title order={3} style={{ flex: 1 }}>
											{t("runner.question", { index: index + 1 })}: {question.question_text}
										</Title>
										{authorName && (
											<Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap", marginLeft: "1rem" }}>
												{t("runner.by", { author: authorName })}
											</Text>
										)}
									</Group>
									<Radio.Group
										value={selectedAnswers[question.id] || ""}
										onChange={value => handleAnswerSelect(question.id, value)}
									>
										<Stack gap="xs">
											{question.answers?.map(answer => (
												<Radio key={answer.id} value={answer.id} label={answer.answer_text} />
											))}
										</Stack>
									</Radio.Group>
								</Stack>
							</Card>
						)
					})}
				</Stack>

				<Group justify="flex-end">
					<Button
						onClick={handleSubmit}
						disabled={!allQuestionsAnswered || submitting}
						loading={submitting}
						leftSection={<IconSend size={16} />}
						size="lg"
					>
						{t("runner.submit")}
					</Button>
				</Group>

				{!allQuestionsAnswered && (
					<Alert icon={<IconAlertCircle size={16} />} title={t("runner.incompleteTitle")} color="yellow">
						{t("runner.incompleteText")}
					</Alert>
				)}
			</Stack>
		</Container>
	)
}
