"use client"

import { useState } from "react"
import { Button, TextInput, Card, Stack, Group, Title, Text } from "@mantine/core"
import { IconTrash, IconPlus } from "@tabler/icons-react"
import { AnswerEditor } from "./AnswerEditor"
import type { Tables, TablesInsert } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

interface QuestionEditorProps {
	question: Question
	onUpdate: (question: Question) => void
	onDelete: () => void
}

export function QuestionEditor({ question, onUpdate, onDelete }: QuestionEditorProps) {
	const [answers, setAnswers] = useState<Tables<"answers">[]>(question.answers ?? [])

	const handleAddAnswer = () => {
		const newAnswer: TablesInsert<"answers"> = {
			answer_text: "",
			is_correct: false,
			question_id: question.id,
		}
		const updatedAnswers = [...answers, newAnswer as Tables<"answers">]
		setAnswers(updatedAnswers)
		onUpdate({ ...question, answers: updatedAnswers })
	}

	const handleUpdateAnswer = (index: number, answer: Tables<"answers">) => {
		const updatedAnswers = [...answers]
		updatedAnswers[index] = answer
		setAnswers(updatedAnswers)
		onUpdate({ ...question, answers: updatedAnswers })
	}

	const handleDeleteAnswer = (index: number) => {
		const updatedAnswers = answers.filter((_, i) => i !== index)
		setAnswers(updatedAnswers)
		onUpdate({ ...question, answers: updatedAnswers })
	}

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack gap="md">
				<Group justify="space-between" align="flex-start" wrap="nowrap">
					<TextInput
						value={question.question_text}
						onChange={e => onUpdate({ ...question, question_text: e.target.value })}
						placeholder="Question text"
						style={{ flex: 1 }}
					/>
					<Button variant="light" color="red" onClick={onDelete} leftSection={<IconTrash size={16} />}>
						Delete Question
					</Button>
				</Group>

				<Stack gap="sm">
					<Group justify="space-between">
						<Title order={5}>Answers</Title>
						<Button variant="outline" onClick={handleAddAnswer} leftSection={<IconPlus size={16} />}>
							Add Answer
						</Button>
					</Group>
					{answers.map((answer, index) => (
						<AnswerEditor
							key={answer.id ?? index}
							answer={answer}
							onUpdate={updatedAnswer => handleUpdateAnswer(index, updatedAnswer)}
							onDelete={() => handleDeleteAnswer(index)}
						/>
					))}
					{answers.length === 0 && (
						<Text size="sm" c="dimmed">
							No answers yet. Click "Add Answer" to add one.
						</Text>
					)}
				</Stack>
			</Stack>
		</Card>
	)
}
