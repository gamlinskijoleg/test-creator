"use client"

import { TextInput, Button, Group, Checkbox, Card, Stack } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import type { Tables } from "@/types/supabase"

type Answer = Tables<"answers">

interface AnswerEditorProps {
	answer: Answer
	onUpdate: (answer: Answer) => void
	onDelete: () => void
}

export function AnswerEditor({ answer, onUpdate, onDelete }: AnswerEditorProps) {
	return (
		<Card padding="sm" withBorder>
			<Group align="flex-start" gap="md" wrap="nowrap">
				<Stack gap="xs" style={{ flex: 1 }}>
					<TextInput
						value={answer.answer_text}
						onChange={e => onUpdate({ ...answer, answer_text: e.target.value })}
						placeholder="Answer text"
					/>
					<Checkbox
						label="Correct answer"
						checked={answer.is_correct ?? false}
						onChange={e => onUpdate({ ...answer, is_correct: e.target.checked })}
					/>
				</Stack>
				<Button variant="light" color="red" onClick={onDelete} leftSection={<IconTrash size={16} />}>
					Delete
				</Button>
			</Group>
		</Card>
	)
}
