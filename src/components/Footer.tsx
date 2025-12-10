"use client"

import Link from "next/link"
import { Container, SimpleGrid, Text, Stack, Anchor, Divider, Group } from "@mantine/core"
import { IconHome, IconDashboard, IconPlus, IconSearch } from "@tabler/icons-react"

export function Footer() {
	return (
		<Container size="xl" py="xl">
			<SimpleGrid cols={{ base: 1, md: 2 }}>
				<Stack gap="xs">
					<Text fw={700} size="lg" c="blue">
						Testy
					</Text>
					<Text size="sm" c="dimmed" maw={280}>
						Create and share interactive tests and quizzes with ease. Track results and engage with your audience.
					</Text>
				</Stack>
				<Stack gap="md">
					<Text fw={600} size="sm">
						Navigation
					</Text>
					<Stack gap="xs">
						<Anchor
							component={Link}
							href="/"
							size="sm"
							c="dimmed"
							style={{ textDecoration: "none", transition: "color 0.2s" }}
							className="footer-link"
						>
							<Group gap={6} wrap="nowrap">
								<IconHome size={16} />
								<span>Home</span>
							</Group>
						</Anchor>
						<Anchor
							component={Link}
							href="/tests"
							size="sm"
							c="dimmed"
							style={{ textDecoration: "none", transition: "color 0.2s" }}
							className="footer-link"
						>
							<Group gap={6} wrap="nowrap">
								<IconSearch size={16} />
								<span>Explore Tests</span>
							</Group>
						</Anchor>
						<Anchor
							component={Link}
							href="/dashboard"
							size="sm"
							c="dimmed"
							style={{ textDecoration: "none", transition: "color 0.2s" }}
							className="footer-link"
						>
							<Group gap={6} wrap="nowrap">
								<IconDashboard size={16} />
								<span>Dashboard</span>
							</Group>
						</Anchor>
						<Anchor
							component={Link}
							href="/create"
							size="sm"
							c="dimmed"
							style={{ textDecoration: "none", transition: "color 0.2s" }}
							className="footer-link"
						>
							<Group gap={6} wrap="nowrap">
								<IconPlus size={16} />
								<span>Create Test</span>
							</Group>
						</Anchor>
					</Stack>
				</Stack>
			</SimpleGrid>
			<Divider my="xl" />
			<Text size="sm" c="dimmed" ta="center">
				© {new Date().getFullYear()} Testy. All rights reserved.
			</Text>
		</Container>
	)
}
