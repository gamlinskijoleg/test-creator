"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/actions/auth"
import { Container, Title, Text, Button, Group, Card, Stack, Grid, GridCol, Box } from "@mantine/core"
import { IconFileText, IconChecklist, IconUsers, IconDashboard, IconPlus, IconLogin } from "@tabler/icons-react"
import type { User } from "@supabase/supabase-js"

export default function Home() {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = await getSession()
			setUser(user)
		}

		fetchUser()

		// Poll for session changes periodically
		const interval = setInterval(() => {
			fetchUser()
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	return (
		<Box>
			{/* Hero Section */}
			<Container size="xl" py={80}>
				<Stack align="center" gap="xl">
					<Title order={1} size="3.5rem" ta="center" fw={900}>
						Create & Take Tests
						<Text component="span" inherit c="blue" display="block" mt="xs">
							Made Simple
						</Text>
					</Title>
					<Text size="xl" c="dimmed" maw={600} ta="center">
						Build interactive quizzes and tests with ease. Share them with others and track results in real-time.
					</Text>
					<Group justify="center" gap="md">
						{user ? (
							<>
								<Button component={Link} href="/dashboard" size="lg" leftSection={<IconDashboard size={20} />}>
									Go to Dashboard
								</Button>
								<Button
									component={Link}
									href="/create"
									size="lg"
									variant="outline"
									leftSection={<IconPlus size={20} />}
								>
									Create Test
								</Button>
							</>
						) : (
							<>
								<Button component={Link} href="/auth" size="lg" leftSection={<IconPlus size={20} />}>
									Get Started
								</Button>
								<Button component={Link} href="/auth" size="lg" variant="outline" leftSection={<IconLogin size={20} />}>
									Sign In
								</Button>
							</>
						)}
					</Group>
				</Stack>
			</Container>

			{/* Features Section */}
			<Container size="xl" py={60}>
				<Title order={2} ta="center" mb={50} fw={700}>
					Everything you need to create amazing tests
				</Title>
				<Grid>
					<GridCol span={{ base: 12, md: 4 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
							<Stack align="center" gap="md">
								<Box
									w={64}
									h={64}
									bg="blue.1"
									style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
								>
									<IconFileText size={32} color="var(--mantine-color-blue-6)" />
								</Box>
								<Title order={3} fw={600}>
									Easy Test Creation
								</Title>
								<Text c="dimmed" ta="center">
									Create tests with multiple questions and answers. Add as many questions as you need with ease.
								</Text>
							</Stack>
						</Card>
					</GridCol>
					<GridCol span={{ base: 12, md: 4 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
							<Stack align="center" gap="md">
								<Box
									w={64}
									h={64}
									bg="green.1"
									style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
								>
									<IconChecklist size={32} color="var(--mantine-color-green-6)" />
								</Box>
								<Title order={3} fw={600}>
									Instant Results
								</Title>
								<Text c="dimmed" ta="center">
									Get immediate feedback with detailed results showing correct and incorrect answers.
								</Text>
							</Stack>
						</Card>
					</GridCol>
					<GridCol span={{ base: 12, md: 4 }}>
						<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
							<Stack align="center" gap="md">
								<Box
									w={64}
									h={64}
									bg="violet.1"
									style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
								>
									<IconUsers size={32} color="var(--mantine-color-violet-6)" />
								</Box>
								<Title order={3} fw={600}>
									Share & Collaborate
								</Title>
								<Text c="dimmed" ta="center">
									Share your tests with anyone. Public links make it easy for others to take your tests.
								</Text>
							</Stack>
						</Card>
					</GridCol>
				</Grid>
			</Container>

			{/* CTA Section */}
			<Container size="xl" py={60}>
				<Card
					shadow="lg"
					padding="xl"
					radius="md"
					style={{
						background: "linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-violet-6) 100%)",
					}}
				>
					<Stack align="center" gap="md">
						<Title order={2} c="white" ta="center" fw={700}>
							Ready to create your first test?
						</Title>
						<Text size="xl" c="blue.1" ta="center">
							Join thousands of users creating amazing tests every day.
						</Text>
						{user ? (
							<Button component={Link} href="/create" size="lg" color="white" variant="filled" c="blue">
								Create Your Test
							</Button>
						) : (
							<Button component={Link} href="/auth" size="lg" color="white" variant="filled" c="blue">
								Get Started Free
							</Button>
						)}
					</Stack>
				</Card>
			</Container>
		</Box>
	)
}
