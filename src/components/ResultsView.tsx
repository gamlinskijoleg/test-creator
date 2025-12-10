"use client"

import { Card, Title, Text, Grid, GridCol, Stack, Badge, Paper, Container, Group } from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
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

export function ResultsView({ result, showCorrectAnswers = true }: ResultsViewProps) {
	const totalQuestions = result.given_answers?.length ?? 0
	const score = result.score ?? 0
	const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
	const { t } = useTranslation()

	return (
		<Container size="md">
			<Stack gap="lg">
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Title order={1}>{t("results.title")}</Title>
						<Title order={2} size="h3" c="dimmed">
							{result.test.title}
						</Title>

						<Grid>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder bg="blue.1">
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="blue">
											{score}
										</Text>
										<Text size="sm" c="dimmed">
											{t("results.correct")}
										</Text>
									</Stack>
								</Paper>
							</GridCol>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder>
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="dimmed">
											{totalQuestions}
										</Text>
										<Text size="sm" c="dimmed">
											{t("results.total")}
										</Text>
									</Stack>
								</Paper>
							</GridCol>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder bg="green.1">
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="green">
											{percentage.toFixed(1)}%
										</Text>
										<Text size="sm" c="dimmed">
											{t("results.score")}
										</Text>
									</Stack>
								</Paper>
							</GridCol>
						</Grid>
					</Stack>
				</Card>

				{showCorrectAnswers && result.given_answers && (
					<Stack gap="md">
						<Title order={3}>{t("results.yourAnswers")}</Title>
						{result.given_answers.map((givenAnswer, index) => {
							const question = givenAnswer.question
							const selectedAnswer = givenAnswer.answer
							const correctAnswer = question.answers?.find(a => a.is_correct)

							const isCorrect = selectedAnswer?.is_correct ?? false

							return (
								<Card key={givenAnswer.id} shadow="sm" padding="lg" radius="md" withBorder>
									<Stack gap="md">
										<Stack gap="xs">
											<Group justify="space-between" align="flex-start">
												<Title order={4}>
													{t("results.question", { index: index + 1 })}: {question.question_text}
												</Title>
												<Badge
													color={isCorrect ? "green" : "red"}
													leftSection={isCorrect ? <IconCheck size={14} /> : <IconX size={14} />}
												>
													{isCorrect ? t("results.badgeCorrect") : t("results.badgeIncorrect")}
												</Badge>
											</Group>
										</Stack>

										<Stack gap="xs">
											<Text size="sm" fw={500} c="dimmed">
												{t("results.yourAnswer")}
											</Text>
											<Paper p="sm" withBorder bg={isCorrect ? "green.1" : "red.1"} c={isCorrect ? "green.9" : "red.9"}>
												{selectedAnswer?.answer_text ?? t("results.noAnswer")}
											</Paper>

											{!isCorrect && correctAnswer && (
												<>
													<Text size="sm" fw={500} c="dimmed">
														{t("results.correctAnswer")}
													</Text>
													<Paper p="sm" withBorder bg="green.1" c="green.9">
														{correctAnswer.answer_text}
													</Paper>
												</>
											)}
										</Stack>
									</Stack>
								</Card>
							)
						})}
					</Stack>
				)}
			</Stack>
		</Container>
	)
}
