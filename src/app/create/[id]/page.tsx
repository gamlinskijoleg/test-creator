"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getTest, saveTestQuestions } from "@/lib/actions/tests"
import { getSession } from "@/lib/actions/auth"
import { TestBuilder } from "@/components/TestBuilder"
import { ShareButtons } from "@/components/ShareButtons"
import { Container, Card, Title, Text, Stack, Group, Button, Loader, Alert } from "@mantine/core"
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react"
import type { Tables } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"

type Question = Tables<"questions"> & {
	answers?: Tables<"answers">[]
}

export default function EditTestPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const testId = params.id

	const [user, setUser] = useState<User | null>(null)
	const [test, setTest] = useState<Tables<"tests"> | null>(null)
	const [questions, setQuestions] = useState<Question[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			const { user } = await getSession()
			setUser(user)

			if (!user) {
				setLoading(false)
				return
			}

			try {
				const result = await getTest(testId)

				if (!result.success || !result.test) {
					throw new Error(result.error || "Failed to load test")
				}

				setTest(result.test)
				setQuestions(result.questions)
			} catch (err) {
				console.error("Error fetching test:", err)
				setError(err instanceof Error ? err.message : "Failed to load test")
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [testId])

	const handleSave = async (updatedQuestions: Question[]) => {
		try {
			const result = await saveTestQuestions(testId, updatedQuestions)

			if (!result.success) {
				throw new Error(result.error || "Failed to save test")
			}

			// Update local state
			setQuestions(updatedQuestions)
			alert("Test saved successfully!")
		} catch (err) {
			console.error("Error saving test:", err)
			alert(err instanceof Error ? `Failed to save test: ${err.message}` : "Failed to save test. Please try again.")
			throw err
		}
	}

	if (loading) {
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
						<Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
							{error || "Test not found"}
						</Alert>
					</Stack>
				</Card>
			</Container>
		)
	}

	if (!user) {
		return (
			<Container
				size="sm"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Title order={2}>Please sign in</Title>
				</Card>
			</Container>
		)
	}

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Button variant="subtle" onClick={() => router.back()} leftSection={<IconArrowLeft size={16} />}>
					Back
				</Button>
				<Group justify="space-between" align="flex-start">
					<Stack gap="xs">
						<Title order={1}>{test.title}</Title>
						{test.description && <Text c="dimmed">{test.description}</Text>}
					</Stack>
					<ShareButtons testId={testId} testTitle={test.title} />
				</Group>

				<TestBuilder testId={testId} initialQuestions={questions} onSave={handleSave} />
			</Stack>
		</Container>
	)
}
