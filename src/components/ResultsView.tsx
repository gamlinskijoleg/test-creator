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
		<Container size="lg">
			<Stack gap="xl">
				<Card
					shadow="xl"
					padding="lg"
					radius="lg"
					withBorder
					style={{
						background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #ec4899 100%)",
						color: "#fff",
					}}
				>
					<Stack gap="md">
						<Title order={1} c="#fff">
							{t("results.title")}
						</Title>
						<Group justify="space-between" align="center">
							<Title order={2} size="h3" c="rgba(255,255,255,0.85)">
								{result.test.title}
							</Title>
							<Badge color="yellow" variant="light" size="lg">
								{t("results.score")} {percentage.toFixed(1)}%
							</Badge>
						</Group>

						<Grid>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder bg="teal.0" radius="md" style={{ borderColor: "rgba(14,165,233,0.2)" }}>
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="teal.8">
											{score}
										</Text>
										<Text size="sm" c="teal.6">
											{t("results.correct")}
										</Text>
									</Stack>
								</Paper>
							</GridCol>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder bg="violet.0" radius="md" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="violet.8">
											{totalQuestions}
										</Text>
										<Text size="sm" c="violet.6">
											{t("results.total")}
										</Text>
									</Stack>
								</Paper>
							</GridCol>
							<GridCol span={{ base: 12, sm: 4 }}>
								<Paper p="md" withBorder bg="orange.0" radius="md" style={{ borderColor: "rgba(234,88,12,0.25)" }}>
									<Stack gap="xs" align="center">
										<Text size="2.5rem" fw={700} c="orange.8">
											{percentage.toFixed(1)}%
										</Text>
										<Text size="sm" c="orange.6">
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
								<Card key={givenAnswer.id} shadow="sm" padding="lg" radius="lg" withBorder>
									<Stack gap="md">
										<Stack gap="xs">
											<Group justify="space-between" align="flex-start">
												<Title order={4} c="dark.6">
													{t("results.question", { index: index + 1 })}: {question.question_text}
												</Title>
												<Badge
													color={isCorrect ? "teal" : "pink"}
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
											<Paper
												p="sm"
												withBorder
												bg={isCorrect ? "teal.0" : "pink.0"}
												c={isCorrect ? "teal.9" : "pink.9"}
												radius="md"
												style={{ borderColor: isCorrect ? "rgba(20,184,166,0.4)" : "rgba(236,72,153,0.35)" }}
											>
												{selectedAnswer?.answer_text ?? t("results.noAnswer")}
											</Paper>

											{!isCorrect && correctAnswer && (
												<>
													<Text size="sm" fw={500} c="dimmed">
														{t("results.correctAnswer")}
													</Text>
													<Paper
														p="sm"
														withBorder
														bg="violet.0"
														c="violet.9"
														radius="md"
														style={{ borderColor: "rgba(99,102,241,0.35)" }}
													>
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
