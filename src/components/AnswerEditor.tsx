"use client"

import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import type { Tables } from "@/types/supabase"

type Answer = Tables<"answers">

interface AnswerEditorProps {
	answer: Answer
	onUpdate: (answer: Answer) => void
	onDelete: () => void
}

export function AnswerEditor({
	answer,
	onUpdate,
	onDelete,
}: AnswerEditorProps) {
	return (
		<div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
			<div className="flex-1 space-y-2">
				<Input
					value={answer.answer_text}
					onChange={e => onUpdate({ ...answer, answer_text: e.target.value })}
					placeholder="Answer text"
				/>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={answer.is_correct ?? false}
						onChange={e =>
							onUpdate({ ...answer, is_correct: e.target.checked })
						}
						className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
					/>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						Correct answer
					</span>
				</label>
			</div>
			<Button variant="danger" onClick={onDelete}>
				Delete
			</Button>
		</div>
	)
}
