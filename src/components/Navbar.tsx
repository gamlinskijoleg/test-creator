"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import { useUser } from "@/lib/hooks/useUser"
import { Group, Button, Text, Loader, Container, Box, Burger, Drawer, Stack, Divider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useTranslation } from "react-i18next"
import { IconDashboard, IconPlus, IconLogout, IconLogin, IconSearch, IconUser } from "@tabler/icons-react"

export function Navbar() {
	const router = useRouter()
	const { user, loading, refresh } = useUser({ polling: true })
	const [opened, { toggle, close }] = useDisclosure(false)
	const { t } = useTranslation()

	const handleSignOut = async () => {
		const result = await signOut()
		if (result.success) {
			await refresh()
			router.push("/")
			close()
		}
	}

	return (
		<>
			<Box h="100%" style={{ display: "flex", alignItems: "center" }}>
				<Container size="xl" style={{ width: "100%" }}>
					<Group h="100%" justify="space-between" wrap="nowrap">
						<Group gap="xl" wrap="nowrap">
							<Text component={Link} href="/" fw={700} size="xl" c="blue" style={{ textDecoration: "none" }}>
								{t("brand")}
							</Text>
							<Group gap="xs" visibleFrom="sm">
								<Button
									component={Link}
									href="/tests"
									variant="subtle"
									leftSection={<IconSearch size={18} />}
									size="sm"
								>
									{t("navbar.explore")}
								</Button>
								{user && (
									<>
										<Button
											component={Link}
											href="/dashboard"
											variant="subtle"
											leftSection={<IconDashboard size={18} />}
											size="sm"
										>
											{t("navbar.dashboard")}
										</Button>
										<Button
											component={Link}
											href="/create"
											variant="subtle"
											leftSection={<IconPlus size={18} />}
											size="sm"
										>
											{t("navbar.create")}
										</Button>
									</>
								)}
							</Group>
						</Group>
						<Group gap="md" wrap="nowrap" align="center">
							{loading ? (
								<Loader size="sm" />
							) : user ? (
								<>
									<Button
										component={Link}
										href="/account"
										variant="subtle"
										leftSection={<IconUser size={16} />}
										size="sm"
										visibleFrom="sm"
									>
										{t("navbar.account")}
									</Button>
								</>
							) : (
								<Button component={Link} href="/auth" leftSection={<IconLogin size={16} />} size="sm">
									{t("navbar.signIn")}
								</Button>
							)}
							<Burger opened={opened} onClick={toggle} hiddenFrom="sm" aria-label="Toggle navigation menu" />
						</Group>
					</Group>
				</Container>
			</Box>
			<Drawer
				opened={opened}
				onClose={close}
				title={t("navbar.menu")}
				padding="md"
				position="left"
				overlayProps={{ blur: 2 }}
				size="80%"
				closeOnClickOutside
				closeOnEscape
			>
				<Stack gap="md">
					<Button
						component={Link}
						href="/tests"
						variant="subtle"
						leftSection={<IconSearch size={18} />}
						onClick={close}
						fullWidth
					>
						{t("navbar.explore")}
					</Button>
					{user && (
						<>
							<Button
								component={Link}
								href="/dashboard"
								variant="subtle"
								leftSection={<IconDashboard size={18} />}
								onClick={close}
								fullWidth
							>
								{t("navbar.dashboard")}
							</Button>
							<Button
								component={Link}
								href="/create"
								variant="subtle"
								leftSection={<IconPlus size={18} />}
								onClick={close}
								fullWidth
							>
								{t("navbar.create")}
							</Button>
							<Button
								component={Link}
								href="/account"
								variant="subtle"
								leftSection={<IconUser size={16} />}
								onClick={close}
								fullWidth
							>
								{t("navbar.account")}
							</Button>
							<Divider />
						</>
					)}
					{loading ? (
						<Loader size="sm" />
					) : user ? (
						<Button variant="light" onClick={handleSignOut} leftSection={<IconLogout size={16} />} fullWidth>
							{t("navbar.signOut")}
						</Button>
					) : (
						<Button component={Link} href="/auth" leftSection={<IconLogin size={16} />} onClick={close} fullWidth>
							{t("navbar.signIn")}
						</Button>
					)}
				</Stack>
			</Drawer>
		</>
	)
}
