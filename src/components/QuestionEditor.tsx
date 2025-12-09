"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
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

export function QuestionEditor({
	question,
	onUpdate,
	onDelete,
}: QuestionEditorProps) {
	const [answers, setAnswers] = useState<Tables<"answers">[]>(
		question.answers ?? [],
	)

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
		<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<Input
						value={question.question_text}
						onChange={e =>
							onUpdate({ ...question, question_text: e.target.value })
						}
						placeholder="Question text"
					/>
				</div>
				<Button variant="danger" onClick={onDelete}>
					Delete Question
				</Button>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Answers
					</h4>
					<Button variant="outline" onClick={handleAddAnswer}>
						Add Answer
					</Button>
				</div>
				{answers.map((answer, index) => (
					<AnswerEditor
						key={answer.id ?? index}
						answer={answer}
						onUpdate={updatedAnswer => handleUpdateAnswer(index, updatedAnswer)}
						onDelete={() => handleDeleteAnswer(index)}
					/>
				))}
				{answers.length === 0 && (
					<p className="text-sm text-gray-500 dark:text-gray-400">
						No answers yet. Click "Add Answer" to add one.
					</p>
				)}
			</div>
		</div>
	)
}
