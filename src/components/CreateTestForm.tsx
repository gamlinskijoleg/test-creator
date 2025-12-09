"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTest } from "@/lib/actions"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import type { User } from "@supabase/supabase-js"

type CreateTestFormProps = {
	user: User
}

export function CreateTestForm({ user }: CreateTestFormProps) {
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		title: "",
		description: "",
	})
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setSubmitting(true)

		try {
			const result = await createTest(
				formData.title,
				formData.description || null,
				user.id,
			)

			if (!result.success || !result.test) {
				throw new Error(result.error || "Failed to create test")
			}

			router.push(`/create/${result.test.id}`)
		} catch (err) {
			console.error("Error creating test:", err)
			setError(err instanceof Error ? err.message : "Failed to create test")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<Card>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
						Create New Test
					</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						<Input
							label="Test Title"
							value={formData.title}
							onChange={e =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
							placeholder="Enter test title"
						/>

						<div>
							<label
								htmlFor="description"
								className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Description (optional)
							</label>
							<textarea
								id="description"
								value={formData.description}
								onChange={e =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder="Enter test description"
								rows={4}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
							/>
						</div>

						{error && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<p className="text-sm text-red-600 dark:text-red-400">
									{error}
								</p>
							</div>
						)}

						<div className="flex gap-3">
							<Button
								type="submit"
								variant="primary"
								disabled={submitting || !formData.title.trim()}
							>
								{submitting ? "Creating..." : "Create Test"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	)
}

