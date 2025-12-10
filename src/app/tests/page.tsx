"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useUser } from "@/lib/hooks/useUser"
import { getAllTestsPaginatedClient } from "@/lib/client/user"
import { useDebouncedValue } from "@mantine/hooks"
import {
	Container,
	Title,
	Card,
	Text,
	Grid,
	GridCol,
	Stack,
	Group,
	Loader,
	Button,
	Box,
	TextInput,
	Select,
	ActionIcon,
	Badge,
} from "@mantine/core"
import { IconPlayerPlay, IconUser, IconSearch, IconX, IconFilter } from "@tabler/icons-react"
import { ShareButtons } from "@/components/ShareButtons"
import type { Tables } from "@/types/supabase"

type Test = Tables<"tests"> & {
	authorProfile: {
		name: string | null
		surname: string | null
	} | null
}

export default function TestsPage() {
	const { user } = useUser()
	const { t } = useTranslation()
	const [tests, setTests] = useState<Test[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [visibleTests, setVisibleTests] = useState<Set<string>>(new Set())
	const [search, setSearch] = useState("")
	const [authorFilter, setAuthorFilter] = useState<"all" | "mine" | "others">("all")
	const [debouncedSearch] = useDebouncedValue(search.trim(), 500)
	const observerTarget = useRef<HTMLDivElement>(null)
	const isLoadingRef = useRef(false)
	const testRefs = useRef<Map<string, HTMLDivElement>>(new Map())
	const pageRef = useRef(1)
	const authorOptions = useMemo(
		() => [
			{ value: "all", label: t("tests.author.all") },
			{ value: "mine", label: t("tests.author.mine") },
			{ value: "others", label: t("tests.author.others") },
		],
		[t],
	)

	const fetchTests = useCallback(
		async (pageNum: number, append: boolean = false, searchTerm?: string, authorScope?: typeof authorFilter) => {
			if (isLoadingRef.current) return

			try {
				isLoadingRef.current = true
				setLoadingMore(true)
				const result = await getAllTestsPaginatedClient(pageNum, undefined, {
					search: searchTerm,
					authorFilter: authorScope,
					userId: user?.id,
				})

				if (result.success) {
					if (append) {
						setTests(prev => [...prev, ...result.tests])
					} else {
						setTests(result.tests)
						pageRef.current = 1
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
		},
		[user?.id],
	)

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			setVisibleTests(new Set())
			await fetchTests(1, false, debouncedSearch, authorFilter)
			setLoading(false)
		}
		load()
	}, [fetchTests, debouncedSearch, authorFilter])

	// Observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !isLoadingRef.current) {
					const nextPage = pageRef.current + 1
					pageRef.current = nextPage
					fetchTests(nextPage, true, debouncedSearch, authorFilter)
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
	}, [hasMore, loadingMore, loading, fetchTests, debouncedSearch, authorFilter])

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

	const getAuthorName = useCallback(
		(test: Test): string => {
			if (!test.authorProfile) return t("tests.author.others")
			const { name, surname } = test.authorProfile
			if (name && surname) return `${name} ${surname}`
			if (name) return name
			if (surname) return surname
			return t("tests.author.others")
		},
		[t],
	)

	const handleClear = useCallback(() => {
		setSearch("")
		setAuthorFilter("all")
	}, [])

	return (
		<Container size="xl" py="xl">
			<Stack gap="lg">
				<Stack gap="xs">
					<Title order={1}>{t("tests.title")}</Title>
					<Group gap="sm" align="flex-end" justify="space-between" wrap="wrap">
						<Group gap="sm" wrap="wrap" style={{ flex: 1, minWidth: 280 }}>
							<TextInput
								placeholder={t("tests.searchPlaceholder")}
								leftSection={<IconSearch size={16} />}
								value={search}
								onChange={e => setSearch(e.currentTarget.value)}
								aria-label={t("tests.searchPlaceholder")}
								style={{ minWidth: 220 }}
							/>
							<Select
								aria-label={t("tests.filterAuthor")}
								leftSection={<IconFilter size={16} />}
								data={[...authorOptions]}
								value={authorFilter}
								onChange={value => {
									if (!user && value !== "all") {
										setAuthorFilter("all")
										return
									}
									setAuthorFilter((value as typeof authorFilter) || "all")
								}}
								styles={{ input: { minWidth: 170 } }}
								disabled={!user}
							/>
						</Group>
						<Group gap="xs">
							{(debouncedSearch || authorFilter !== "all") && (
								<Badge variant="light" color="blue">
									{debouncedSearch ? t("tests.badgeSearch", { value: debouncedSearch }) : t("tests.badgeFilters")}
								</Badge>
							)}
							<ActionIcon variant="subtle" onClick={handleClear} aria-label={t("tests.clear")}>
								<IconX size={16} />
							</ActionIcon>
						</Group>
					</Group>
				</Stack>

				{tests.length === 0 && !loadingMore ? (
					<Card shadow="sm" padding="xl" radius="md" withBorder>
						<Stack gap="md" align="center">
							<Text c="dimmed" ta="center">
								{t("tests.noTests")}
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
																{t("tests.yourTest")}
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
																	{t("tests.edit")}
																</Button>
															)}
															<Button
																component={Link}
																href={`/test/${test.id}`}
																style={{ flex: isOwner ? 1 : undefined, width: isOwner ? undefined : "100%" }}
																leftSection={<IconPlayerPlay size={16} />}
															>
																{t("tests.take")}
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
											{t("tests.loadingMore")}
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
