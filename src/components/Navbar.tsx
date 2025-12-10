"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, signOut } from "@/lib/actions/auth"
import { Group, Button, Text, Loader, Container, Box } from "@mantine/core"
import { IconDashboard, IconPlus, IconLogout, IconLogin, IconSearch, IconUser } from "@tabler/icons-react"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = await getSession()
			setUser(user)
			setLoading(false)
		}

		fetchUser()

		// Poll for session changes periodically
		const interval = setInterval(() => {
			fetchUser()
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	const handleSignOut = async () => {
		const result = await signOut()
		if (result.success) {
			setUser(null)
			router.push("/")
		}
	}

	return (
		<Box h="100%" style={{ display: "flex", alignItems: "center" }}>
			<Container size="xl" style={{ width: "100%" }}>
				<Group h="100%" justify="space-between" wrap="nowrap">
					<Group gap="xl" wrap="nowrap">
						<Text component={Link} href="/" fw={700} size="xl" c="blue" style={{ textDecoration: "none" }}>
							Testy
						</Text>
						<Group gap="xs" visibleFrom="sm">
							<Button component={Link} href="/tests" variant="subtle" leftSection={<IconSearch size={18} />} size="sm">
								Explore Tests
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
										Dashboard
									</Button>
									<Button
										component={Link}
										href="/create"
										variant="subtle"
										leftSection={<IconPlus size={18} />}
										size="sm"
									>
										Create Test
									</Button>
								</>
							)}
						</Group>
					</Group>
					<Group gap="md" wrap="nowrap">
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
									Account
								</Button>
								<Button variant="light" onClick={handleSignOut} leftSection={<IconLogout size={16} />} size="sm">
									Sign Out
								</Button>
							</>
						) : (
							<Button component={Link} href="/auth" leftSection={<IconLogin size={16} />} size="sm">
								Sign In
							</Button>
						)}
					</Group>
				</Group>
			</Container>
		</Box>
	)
}
