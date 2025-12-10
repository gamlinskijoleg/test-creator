"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Card, Container, Title, Text, Stack, Button } from "@mantine/core"

export function UnauthenticatedMessage() {
	const { t } = useTranslation()

	return (
		<Container
			size="sm"
			style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="md">
					<Title order={2}>{t("unauth.title")}</Title>
					<Text c="dimmed">{t("unauth.text")}</Text>
					<Button component={Link} href="/auth">
						{t("unauth.signIn")}
					</Button>
				</Stack>
			</Card>
		</Container>
	)
}
