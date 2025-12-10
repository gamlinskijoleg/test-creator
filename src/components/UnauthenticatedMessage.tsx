"use client"

import Link from "next/link"
import { Card, Container, Title, Text, Stack, Button } from "@mantine/core"

export function UnauthenticatedMessage() {
	return (
		<Container
			size="sm"
			style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="md">
					<Title order={2}>Please sign in</Title>
					<Text c="dimmed">You need to be signed in to access this page.</Text>
					<Button component={Link} href="/auth">
						Sign In
					</Button>
				</Stack>
			</Card>
		</Container>
	)
}
