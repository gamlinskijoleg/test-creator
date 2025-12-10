import { getSession } from "@/lib/actions/auth"
import { CreateTestForm } from "@/components/CreateTestForm"
import { Card, Container, Title, Text, Stack, Button } from "@mantine/core"
import Link from "next/link"

// Force dynamic rendering since we use cookies for authentication
export const dynamic = "force-dynamic"

export default async function CreateTestPage() {
	const { user } = await getSession()

	if (!user) {
		return (
			<Container
				size="sm"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Stack gap="md">
						<Title order={2}>Please sign in</Title>
						<Text c="dimmed">You need to be signed in to create a test.</Text>
						<Button component={Link} href="/auth">
							Sign In
						</Button>
					</Stack>
				</Card>
			</Container>
		)
	}

	return <CreateTestForm userId={user.id} />
}
