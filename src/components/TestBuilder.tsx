"use client"

import { useState } from "react"
import { Button } from "./ui/Button"
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

export function TestBuilder({
	testId,
	initialQuestions = [],
	onSave,
}: TestBuilderProps) {
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
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Test Builder
				</h2>
				<div className="flex gap-3">
					<Button variant="outline" onClick={handleAddQuestion}>
						Add Question
					</Button>
					<Button variant="primary" onClick={handleSave} disabled={saving}>
						{saving ? "Saving..." : "Save Test"}
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				{questions.map((question, index) => (
					<QuestionEditor
						key={question.id ?? index}
						question={question}
						onUpdate={updatedQuestion =>
							handleUpdateQuestion(index, updatedQuestion)
						}
						onDelete={() => handleDeleteQuestion(index)}
					/>
				))}
				{questions.length === 0 && (
					<div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
						<p className="text-gray-500 dark:text-gray-400 mb-4">
							No questions yet. Click "Add Question" to get started.
						</p>
						<Button variant="primary" onClick={handleAddQuestion}>
							Add First Question
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
