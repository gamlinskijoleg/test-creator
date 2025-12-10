"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { deleteTest, getTest, saveTestQuestions } from "@/lib/actions/tests"
import { useUser } from "@/lib/hooks/useUser"
import { TestBuilder } from "@/components/TestBuilder"
import { CopyLinkButton, ShareButton } from "@/components/ShareButtons"
import { Container, Card, Title, Text, Stack, Group, Button, Loader, Alert } from "@mantine/core"
import { IconArrowLeft, IconAlertCircle, IconTrash } from "@tabler/icons-react"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"
import type { Tables } from "@/types/supabase"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

export default function EditTestPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const testId = params.id
	const { t } = useTranslation()

	const { user, loading: userLoading } = useUser()
	const [test, setTest] = useState<Tables<"tests"> | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (!userLoading) {
			if (!user) {
				setLoading(false)
				return
			}

			const fetchData = async () => {
				try {
					const result = await getTest(testId)

					if (!result.success || !result.test) {
						throw new Error(result.error || t("errors.testNotFound"))
					}

					setTest(result.test)
					setQuestions(result.questions)
				} catch (err) {
					console.error("Error fetching test:", err)
					setError(err instanceof Error ? err.message : t("errors.testNotFound"))
				} finally {
					setLoading(false)
				}
			}

			fetchData()
		}
	}, [testId, user, userLoading])

	const handleSave = async (updatedQuestions: Question[]) => {
		try {
			const result = await saveTestQuestions(testId, updatedQuestions)

			if (!result.success) {
				throw new Error(result.error || t("editTest.saveFailed"))
			}

			// Update local state
			setQuestions(updatedQuestions)
			alert(t("editTest.saveSuccess"))
		} catch (err) {
			console.error("Error saving test:", err)
			alert(err instanceof Error ? err.message : t("editTest.saveFailed"))
			throw err
		}
	}

	const handleDelete = async () => {
		if (!test || !user) return
		const confirmed = confirm(t("editTest.deleteConfirm", { title: test.title }))
		if (!confirmed) return

		setDeleting(true)
		try {
			const result = await deleteTest(testId, user.id)

			if (!result.success) {
				throw new Error(result.error || t("editTest.deleteFailed"))
			}

			alert(t("editTest.deleteSuccess"))
			router.push("/dashboard")
		} catch (err) {
			console.error("Error deleting test:", err)
			alert(err instanceof Error ? err.message : t("editTest.deleteFailed"))
		} finally {
			setDeleting(false)
		}
	}

	if (loading || userLoading) {
		return (
			<Container
				size="xl"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Loader />
			</Container>
		)
	}

	if (error || !test) {
		return (
			<Container
				size="sm"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Title order={2}>Error</Title>
						<Alert icon={<IconAlertCircle size={16} />} title={t("editTest.error")} color="red">
							{error || t("editTest.notFound")}
						</Alert>
					</Stack>
				</Card>
			</Container>
		)
	}

	if (!user) {
		return <UnauthenticatedMessage />
	}

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Button variant="subtle" onClick={() => router.back()} leftSection={<IconArrowLeft size={16} />}>
					{t("editTest.back")}
				</Button>
				<Group justify="space-between" align="flex-start">
					<Stack gap="xs">
						<Title order={1}>{test.title}</Title>
						{test.description && <Text c="dimmed">{test.description}</Text>}
					</Stack>
					<Group gap="xs">
						{user?.id === test.author_id && (
							<Button
								color="red"
								variant="light"
								onClick={handleDelete}
								loading={deleting}
								leftSection={<IconTrash size={16} />}
							>
								{t("editTest.delete")}
							</Button>
						)}
						<ShareButton testId={testId} testTitle={test.title} />
						<CopyLinkButton testId={testId} />
					</Group>
				</Group>

				<TestBuilder testId={testId} initialQuestions={questions} onSave={handleSave} />
			</Stack>
		</Container>
	)
}
