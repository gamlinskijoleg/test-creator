"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { getSession } from "@/lib/actions/auth"
import { getAllTestsPaginatedClient } from "@/lib/client/user"
import { Container, Title, Card, Text, Grid, GridCol, Stack, Group, Loader, Button } from "@mantine/core"
import { IconPlayerPlay } from "@tabler/icons-react"
import { ShareButtons } from "@/components/ShareButtons"
import type { Tables } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"

type Test = Tables<"tests">

export default function TestsPage() {
	const [user, setUser] = useState<User | null>(null)
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)
	const observerTarget = useRef<HTMLDivElement>(null)
	const isLoadingRef = useRef(false)

	const fetchTests = useCallback(async (pageNum: number, append: boolean = false) => {
		if (isLoadingRef.current) return

		try {
			isLoadingRef.current = true
			setLoadingMore(true)
			const result = await getAllTestsPaginatedClient(pageNum)

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
		const fetchUserAndTests = async () => {
			const { user } = await getSession()
			setUser(user)
			await fetchTests(1, false)
			setLoading(false)
		}

		fetchUserAndTests()
	}, [fetchTests])

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !isLoadingRef.current) {
					setPage(prevPage => {
						const nextPage = prevPage + 1
						fetchTests(nextPage, true)
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
	}, [hasMore, loadingMore, loading, fetchTests])

	if (loading) {
		return (
			<Container
				size="xl"
				style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Loader />
			</Container>
		)
	}

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Title order={1}>Explore Tests</Title>

				{tests.length === 0 && !loadingMore ? (
					<Card shadow="sm" padding="xl" radius="md" withBorder>
						<Stack gap="md" align="center">
							<Text c="dimmed" ta="center">
								No tests available yet.
							</Text>
						</Stack>
					</Card>
				) : (
					<>
						<Grid>
							{tests.map(test => {
								const isOwner = user?.id === test.author_id

								return (
									<GridCol key={test.id} span={{ base: 12, md: 6, lg: 4 }}>
										<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
											<Stack gap="md" justify="space-between" h="100%">
												<Stack gap="xs">
													<Title order={3}>{test.title}</Title>
													{test.description && (
														<Text c="dimmed" lineClamp={2}>
															{test.description}
														</Text>
													)}
													{isOwner && (
														<Text size="xs" c="blue">
															Your test
														</Text>
													)}
												</Stack>
												<Stack gap="xs">
													<Group gap="xs">
														{isOwner && (
															<Button
																component={Link}
																href={`/create/${test.id}`}
																variant="outline"
																style={{ flex: 1 }}
															>
																Edit
															</Button>
														)}
														<Button
															component={Link}
															href={`/test/${test.id}`}
															style={{ flex: isOwner ? 1 : undefined, width: isOwner ? undefined : "100%" }}
															leftSection={<IconPlayerPlay size={16} />}
														>
															Take Test
														</Button>
													</Group>
													<ShareButtons testId={test.id} testTitle={test.title} />
												</Stack>
											</Stack>
										</Card>
									</GridCol>
								)
							})}
						</Grid>
						{hasMore && (
							<div ref={observerTarget} style={{ height: "20px", marginTop: "20px" }}>
								{loadingMore && (
									<Stack align="center" gap="md" py="xl">
										<Loader size="sm" />
										<Text size="sm" c="dimmed">
											Loading more tests...
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
