"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { getSession } from "@/lib/actions/auth"
import { getAllTestsPaginatedClient } from "@/lib/client/user"
import { Container, Title, Card, Text, Grid, GridCol, Stack, Group, Loader, Button, Box } from "@mantine/core"
import { IconPlayerPlay, IconUser } from "@tabler/icons-react"
import { ShareButtons } from "@/components/ShareButtons"
import type { Tables } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"

type Test = Tables<"tests"> & {
	authorProfile: {
		name: string | null
		surname: string | null
	} | null
}

export default function TestsPage() {
	const [user, setUser] = useState<User | null>(null)
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)
	const [visibleTests, setVisibleTests] = useState<Set<string>>(new Set())
	const observerTarget = useRef<HTMLDivElement>(null)
	const isLoadingRef = useRef(false)
	const testRefs = useRef<Map<string, HTMLDivElement>>(new Map())

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

	// Observer for infinite scroll
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

	// Observer for fade-in animation on each test card
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const testId = entry.target.getAttribute("data-test-id")
						if (testId) {
							setVisibleTests(prev => new Set(prev).add(testId))
						}
					}
				})
			},
			{ threshold: 0.1 },
		)

		testRefs.current.forEach(element => {
			if (element) {
				observer.observe(element)
			}
		})

		return () => {
			testRefs.current.forEach(element => {
				if (element) {
					observer.unobserve(element)
				}
			})
		}
	}, [tests])

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

	const getAuthorName = (test: Test): string => {
		if (!test.authorProfile) return "Unknown"
		const { name, surname } = test.authorProfile
		if (name && surname) return `${name} ${surname}`
		if (name) return name
		if (surname) return surname
		return "Unknown"
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
							{tests.map((test, index) => {
								const isOwner = user?.id === test.author_id
								const isVisible = visibleTests.has(test.id)

								return (
									<GridCol key={test.id} span={{ base: 12, md: 6, lg: 4 }}>
										<div
											ref={(el: HTMLDivElement | null) => {
												if (el) {
													testRefs.current.set(test.id, el)
												} else {
													testRefs.current.delete(test.id)
												}
											}}
											data-test-id={test.id}
											style={{
												opacity: isVisible ? 1 : 0,
												transform: isVisible ? "translateY(0)" : "translateY(10px)",
												transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
											}}
										>
											<Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
												<Stack gap="md" justify="space-between" h="100%">
													<Stack gap="xs">
														<Title order={3}>{test.title}</Title>
														{test.description && (
															<Text c="dimmed" lineClamp={2}>
																{test.description}
															</Text>
														)}
														<Group gap="xs" align="center">
															<IconUser size={14} style={{ opacity: 0.7 }} />
															<Text size="sm" c="dimmed">
																{getAuthorName(test)}
															</Text>
														</Group>
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
										</div>
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
