"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { createTest } from "@/lib/actions/tests"
import { Card, Title, TextInput, Textarea, Button, Stack, Alert, Group, Container } from "@mantine/core"
import { IconAlertCircle, IconX } from "@tabler/icons-react"
type CreateTestFormProps = {
	userId: string
}

export function CreateTestForm({ userId }: CreateTestFormProps) {
	const router = useRouter()
	const { t } = useTranslation()
	const [error, setError] = useState<string | null>(null)

	const createTestSchema = useMemo(
		() =>
			z.object({
				title: z
					.string()
					.min(1, { message: t("createForm.required") })
					.trim(),
				description: z.string().optional(),
			}),
		[t],
	)

	type CreateTestFormData = z.infer<typeof createTestSchema>

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
				throw new Error(result.error || t("createForm.failed"))
			}

			router.push(`/create/${result.test.id}`)
		} catch (err) {
			console.error("Error creating test:", err)
			setError(err instanceof Error ? err.message : t("createForm.failed"))
		}
	}

	return (
		<Container size="md" py="xl">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="lg">
					<Title order={1}>{t("createForm.title")}</Title>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="md">
							<TextInput
								label={t("createForm.testTitle")}
								{...register("title")}
								error={errors.title?.message}
								required
								placeholder={t("createForm.testTitlePlaceholder")}
							/>

							<Textarea
								label={t("createForm.description")}
								{...register("description")}
								error={errors.description?.message}
								placeholder={t("createForm.descriptionPlaceholder")}
								rows={4}
							/>

							{error && (
								<Alert icon={<IconAlertCircle size={16} />} title={t("createForm.errorTitle")} color="red">
									{error}
								</Alert>
							)}

							<Group justify="flex-end">
								<Button type="button" variant="outline" onClick={() => router.back()} leftSection={<IconX size={16} />}>
									{t("createForm.cancel")}
								</Button>
								<Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
									{t("createForm.submit")}
								</Button>
							</Group>
						</Stack>
					</form>
				</Stack>
			</Card>
		</Container>
	)
}
