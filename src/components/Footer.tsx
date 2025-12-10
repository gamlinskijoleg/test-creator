"use client"

import Link from "next/link"
import { Container, SimpleGrid, Text, Stack, Anchor, Divider, Group } from "@mantine/core"
import { IconHome, IconDashboard, IconPlus, IconSearch } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

export function Footer() {
	const { t } = useTranslation()

	return (
		<Container size="xl" py="xl">
			<SimpleGrid cols={{ base: 1, md: 2 }}>
				<Stack gap="xs">
					<Text fw={700} size="lg" c="blue">
						{t("brand")}
					</Text>
					<Text size="sm" c="dimmed" maw={280}>
						{t("footer.tagline")}
					</Text>
				</Stack>
				<Stack gap="md">
					<Text fw={600} size="sm">
						{t("footer.navigation")}
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
								<span>{t("footer.home")}</span>
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
								<span>{t("footer.explore")}</span>
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
								<span>{t("footer.dashboard")}</span>
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
								<span>{t("footer.create")}</span>
							</Group>
						</Anchor>
					</Stack>
				</Stack>
			</SimpleGrid>
			<Divider my="xl" />
			<Text size="sm" c="dimmed" ta="center">
				© {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
			</Text>
		</Container>
	)
}
