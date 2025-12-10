"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useUser } from "@/lib/hooks/useUser"
import { Container, Title, Text, Button, Group, Card, Stack, Grid, GridCol, Box } from "@mantine/core"
import { IconFileText, IconChecklist, IconUsers, IconDashboard, IconPlus, IconLogin } from "@tabler/icons-react"

export default function Home() {
	const router = useRouter()
	const { t } = useTranslation()
	const { user } = useUser({ polling: true })

	return (
		<Box>
			{/* Hero Section */}
			<Container size="xl" py={80}>
				<Stack align="center" gap="xl">
					<Title order={1} size="3.5rem" ta="center" fw={900}>
						{t("home.heroTitle")}
						<Text component="span" inherit c="blue" display="block" mt="xs">
							{t("home.heroHighlight")}
						</Text>
					</Title>
					<Text size="xl" c="dimmed" maw={600} ta="center">
						{t("home.heroSubtitle")}
					</Text>
					<Group justify="center" gap="md">
						{user ? (
							<>
								<Button component={Link} href="/dashboard" size="lg" leftSection={<IconDashboard size={20} />}>
									{t("home.goDashboard")}
								</Button>
								<Button
									component={Link}
									href="/create"
									size="lg"
									variant="outline"
									leftSection={<IconPlus size={20} />}
								>
									{t("home.createTest")}
								</Button>
							</>
						) : (
							<>
								<Button component={Link} href="/auth" size="lg" leftSection={<IconPlus size={20} />}>
									{t("home.getStarted")}
								</Button>
								<Button component={Link} href="/auth" size="lg" variant="outline" leftSection={<IconLogin size={20} />}>
									{t("home.signIn")}
								</Button>
							</>
						)}
					</Group>
				</Stack>
			</Container>

			{/* Features Section */}
			<Container size="xl" py={60}>
				<Title order={2} ta="center" mb={50} fw={700}>
					{t("home.featuresTitle")}
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
									{t("home.featureEasyTitle")}
								</Title>
								<Text c="dimmed" ta="center">
									{t("home.featureEasyText")}
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
									{t("home.featureResultsTitle")}
								</Title>
								<Text c="dimmed" ta="center">
									{t("home.featureResultsText")}
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
									{t("home.featureShareTitle")}
								</Title>
								<Text c="dimmed" ta="center">
									{t("home.featureShareText")}
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
							{t("home.ctaTitle")}
						</Title>
						<Text size="xl" c="blue.1" ta="center">
							{t("home.ctaSubtitle")}
						</Text>
						{user ? (
							<Button component={Link} href="/create" size="lg" color="white" variant="filled" c="blue">
								{t("home.ctaCreate")}
							</Button>
						) : (
							<Button component={Link} href="/auth" size="lg" color="white" variant="filled" c="blue">
								{t("home.ctaStart")}
							</Button>
						)}
					</Stack>
				</Card>
			</Container>
		</Box>
	)
}
