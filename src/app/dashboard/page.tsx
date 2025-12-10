"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useUser } from "@/lib/hooks/useUser"
import { getUserTestsPaginated } from "@/lib/actions/user"
import { Container, Title, Button, Card, Text, Grid, GridCol, Stack, Group, Loader } from "@mantine/core"
import { IconPlus, IconEdit, IconPlayerPlay, IconHistory } from "@tabler/icons-react"
import { CopyLinkButton, ShareButton } from "@/components/ShareButtons"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"
import type { Tables } from "@/types/supabase"

type Test = Tables<"tests">

export default function DashboardPage() {
	const { user, loading: userLoading } = useUser()
	const { t } = useTranslation()
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)
	const observerTarget = useRef<HTMLDivElement>(null)
	const isLoadingRef = useRef(false)

	const fetchTests = useCallback(async (userId: string, pageNum: number, append: boolean = false) => {
		if (isLoadingRef.current) return

		try {
			isLoadingRef.current = true
			setLoadingMore(true)
			const result = await getUserTestsPaginated(userId, pageNum)

			if (result.success) {
				if (append) {
					setTests(prev => [...prev, ...result.tests])
				} else {
					setTests(result.tests)
					setPage(1)
				}
				setHasMore(result.hasMore)
			} else {
				console.error("Failed to fetch tests:", result.error)
			}
		} catch (error) {
			console.error("Error fetching tests:", error)
		} finally {
			setLoadingMore(false)
			isLoadingRef.current = false
		}
	}, [])

	useEffect(() => {
		if (!userLoading && user) {
			fetchTests(user.id, 1, false)
			setLoading(false)
		} else if (!userLoading) {
			setLoading(false)
		}
	}, [user, userLoading, fetchTests])

	useEffect(() => {
		if (!user || !hasMore || loadingMore || loading) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !isLoadingRef.current && user) {
					setPage(prevPage => {
						const nextPage = prevPage + 1
						fetchTests(user.id, nextPage, true)
						return nextPage
					})
				}
			},
			{ threshold: 0.1 },
		)

		const currentTarget = observerTarget.current
		if (currentTarget) {
			observer.observe(currentTarget)
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget)
			}
		}
	}, [hasMore, loadingMore, loading, user, fetchTests])

	if (loading || userLoading) {
		return (
			<Container
				size="xl"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Loader />
			</Container>
		)
	}

	if (!user) {
		return <UnauthenticatedMessage />
	}

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Group justify="space-between">
					<Title order={1}>{t("dashboard.title")}</Title>
					<Button component={Link} href="/create" leftSection={<IconPlus size={16} />}>
						{t("dashboard.create")}
					</Button>
				</Group>

				{tests.length === 0 && !loadingMore ? (
					<Card shadow="sm" padding="xl" radius="md" withBorder>
						<Stack gap="md" align="center">
							<Text c="dimmed" ta="center">
								{t("dashboard.empty")}
							</Text>
							<Button component={Link} href="/create" leftSection={<IconPlus size={16} />}>
								{t("dashboard.emptyCta")}
							</Button>
						</Stack>
					</Card>
				) : (
					<>
						<Grid>
							{tests.map(test => (
								<GridCol key={test.id} span={{ base: 12, md: 6, lg: 4 }}>
									<Card
										shadow="xl"
										padding="lg"
										radius="lg"
										withBorder
										h="100%"
										style={{
											background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))",
											borderColor: "rgba(99,102,241,0.25)",
										}}
									>
										<Stack gap="md" justify="space-between" h="100%">
											<Stack gap="xs">
												<Title order={3}>{test.title}</Title>
												{test.description ? (
													<Text c="dimmed" lineClamp={3}>
														{test.description}
													</Text>
												) : (
													<Text c="dimmed" size="sm">
														{t("dashboard.emptyCta")}
													</Text>
												)}
											</Stack>

											<Stack gap="sm">
												<Button
													component={Link}
													href={`/test/${test.id}`}
													variant="filled"
													leftSection={<IconPlayerPlay size={16} />}
												>
													{t("tests.take")}
												</Button>
												<Group gap="xs" grow>
													<Button
														component={Link}
														href={`/create/${test.id}`}
														variant="outline"
														leftSection={<IconEdit size={16} />}
													>
														{t("tests.edit")}
													</Button>
												</Group>
												<Group gap="xs" grow>
													<Button
														component={Link}
														href={`/dashboard/tests/${test.id}/results`}
														variant="light"
														color="grape"
														leftSection={<IconHistory size={16} />}
														aria-label={t("dashboard.results")}
														title={t("dashboard.results")}
														px="xs"
														size="sm"
													/>
													<Group gap="xs" justify="flex-end">
														<ShareButton testId={test.id} testTitle={test.title} iconOnly />
														<CopyLinkButton testId={test.id} iconOnly />
													</Group>
												</Group>
											</Stack>
										</Stack>
									</Card>
								</GridCol>
							))}
						</Grid>
						{hasMore && (
							<div ref={observerTarget} style={{ height: "20px", marginTop: "20px" }}>
								{loadingMore && (
									<Stack align="center" gap="md" py="xl">
										<Loader size="sm" />
										<Text size="sm" c="dimmed">
											{t("dashboard.loadingMore")}
										</Text>
									</Stack>
								)}
							</div>
						)}
					</>
				)}
			</Stack>
		</Container>
	)
}
