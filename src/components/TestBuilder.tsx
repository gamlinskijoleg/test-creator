"use client"

import { useState } from "react"
import { Button, Group, Title, Stack, Paper, Text } from "@mantine/core"
import { IconPlus, IconDeviceFloppy } from "@tabler/icons-react"
import { QuestionEditor } from "./QuestionEditor"
import type { Tables, TablesInsert } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

interface TestBuilderProps {
	testId: string
	initialQuestions?: Question[]
	onSave: (questions: Question[]) => Promise<void>
}

export function TestBuilder({ testId, initialQuestions = [], onSave }: TestBuilderProps) {
	const [questions, setQuestions] = useState<Question[]>(initialQuestions)
	const [saving, setSaving] = useState(false)

	const handleAddQuestion = () => {
		const newQuestion: TablesInsert<"questions"> = {
			question_text: "",
			test_id: testId,
			order_index: questions.length,
		}
		setQuestions([...questions, newQuestion as Question])
	}

	const handleUpdateQuestion = (index: number, question: Question) => {
		const updatedQuestions = [...questions]
		updatedQuestions[index] = question
		setQuestions(updatedQuestions)
	}

	const handleDeleteQuestion = (index: number) => {
		const updatedQuestions = questions.filter((_, i) => i !== index)
		setQuestions(updatedQuestions)
	}

	const handleSave = async () => {
		setSaving(true)
		try {
			await onSave(questions)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Stack gap="lg">
			<Group justify="space-between">
				<Title order={2}>Test Builder</Title>
				<Group gap="sm">
					<Button variant="outline" onClick={handleAddQuestion} leftSection={<IconPlus size={16} />}>
						Add Question
					</Button>
					<Button onClick={handleSave} disabled={saving} loading={saving} leftSection={<IconDeviceFloppy size={16} />}>
						Save Test
					</Button>
				</Group>
			</Group>

			<Stack gap="md">
				{questions.map((question, index) => (
					<QuestionEditor
						key={question.id ?? index}
						question={question}
						onUpdate={updatedQuestion => handleUpdateQuestion(index, updatedQuestion)}
						onDelete={() => handleDeleteQuestion(index)}
					/>
				))}
				{questions.length === 0 && (
					<Paper
						p="xl"
						withBorder
						style={{
							borderStyle: "dashed",
							textAlign: "center",
						}}
					>
						<Stack gap="md" align="center">
							<Text c="dimmed">No questions yet. Click "Add Question" to get started.</Text>
							<Button onClick={handleAddQuestion} leftSection={<IconPlus size={16} />}>
								Add First Question
							</Button>
						</Stack>
					</Paper>
				)}
			</Stack>
		</Stack>
	)
}
