"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createTest } from "@/lib/actions/tests"
import { Card, Title, TextInput, Textarea, Button, Stack, Alert, Group, Container } from "@mantine/core"
import { IconAlertCircle, IconX } from "@tabler/icons-react"
type CreateTestFormProps = {
	userId: string
}

const createTestSchema = z.object({
	title: z.string().min(1, "Test title is required").trim(),
	description: z.string().optional(),
})

type CreateTestFormData = z.infer<typeof createTestSchema>

export function CreateTestForm({ userId }: CreateTestFormProps) {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateTestFormData>({
		resolver: zodResolver(createTestSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	})

	const onSubmit = async (data: CreateTestFormData) => {
		setError(null)

		try {
			const result = await createTest(data.title, data.description || null, userId)

			if (!result.success || !result.test) {
				throw new Error(result.error || "Failed to create test")
			}

			router.push(`/create/${result.test.id}`)
		} catch (err) {
			console.error("Error creating test:", err)
			setError(err instanceof Error ? err.message : "Failed to create test")
		}
	}

	return (
		<Container size="md" py="xl">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="lg">
					<Title order={1}>Create New Test</Title>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="md">
							<TextInput
								label="Test Title"
								{...register("title")}
								error={errors.title?.message}
								required
								placeholder="Enter test title"
							/>

							<Textarea
								label="Description (optional)"
								{...register("description")}
								error={errors.description?.message}
								placeholder="Enter test description"
								rows={4}
							/>

							{error && (
								<Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
									{error}
								</Alert>
							)}

							<Group justify="flex-end">
								<Button type="button" variant="outline" onClick={() => router.back()} leftSection={<IconX size={16} />}>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
									Create Test
								</Button>
							</Group>
						</Stack>
					</form>
				</Stack>
			</Card>
		</Container>
	)
}
