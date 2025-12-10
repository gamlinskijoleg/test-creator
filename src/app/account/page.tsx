"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { useUser } from "@/lib/hooks/useUser"
import { getUserProfile, upsertUserProfile } from "@/lib/actions/user"
import { Container, Card, Title, TextInput, Button, Stack, Group, Loader, Select, Text, Alert } from "@mantine/core"
import {
	IconUser,
	IconDeviceFloppy,
	IconArrowLeft,
	IconCheck,
	IconAlertCircle,
	IconCalendar,
	IconLanguage,
} from "@tabler/icons-react"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/i18n/config"

const accountSchema = z.object({
	name: z.string().optional(),
	surname: z.string().optional(),
	birthdate: z.date().nullable().optional(),
	pronouns: z.string().optional(),
	city: z.string().optional(),
	language: z.enum(SUPPORTED_LOCALES).optional(),
})

type AccountFormData = z.infer<typeof accountSchema>

export default function AccountPage() {
	const router = useRouter()
	const { user, loading: userLoading } = useUser()
	const { t, i18n } = useTranslation()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<AccountFormData>({
		resolver: zodResolver(accountSchema),
		defaultValues: {
			name: "",
			surname: "",
			birthdate: null,
			pronouns: "",
			city: "",
			language: DEFAULT_LOCALE,
		},
	})

	const pronounsOptions = useMemo(
		() => [
			{ value: "he/him", label: t("account.options.he") },
			{ value: "she/her", label: t("account.options.she") },
			{ value: "they/them", label: t("account.options.they") },
			{ value: "other", label: t("account.options.other") },
			{ value: "prefer-not-to-say", label: t("account.options.none") },
		],
		[t],
	)

	const languageOptions = useMemo(
		() =>
			SUPPORTED_LOCALES.map(locale => ({
				value: locale,
				label: `${locale === "en" ? "🇺🇸" : "🇺🇦"} ${t(`language.${locale}`)}`,
			})),
		[t],
	)

	useEffect(() => {
		if (!userLoading) {
			if (!user) {
				setLoading(false)
				return
			}

			// Load user profile
			const fetchProfile = async () => {
				const profileResult = await getUserProfile(user.id)
				if (profileResult.success && profileResult.profile) {
					const profile = profileResult.profile
					reset({
						name: profile.name || "",
						surname: profile.surname || "",
						birthdate: profile.birthdate ? new Date(profile.birthdate) : null,
						pronouns: profile.pronouns || "",
						city: profile.city || "",
						language: (profile.language as Locale | null) || DEFAULT_LOCALE,
					})
				}
				setLoading(false)
			}

			fetchProfile()
		}
	}, [user, userLoading, reset])

	const onSubmit = async (data: AccountFormData) => {
		if (!user) return

		setError(null)
		setSuccess(null)

		try {
			const result = await upsertUserProfile(user.id, {
				name: data.name || null,
				surname: data.surname || null,
				birthdate: data.birthdate ? data.birthdate.toISOString().split("T")[0] : null,
				pronouns: data.pronouns || null,
				city: data.city || null,
				language: data.language || DEFAULT_LOCALE,
			})

			if (!result.success) {
				setError(result.error || t("account.failed"))
			} else {
				setSuccess(t("account.successText"))
				const nextLocale = data.language || DEFAULT_LOCALE
				document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`
				await i18n.changeLanguage(nextLocale)
			}
		} catch (err) {
			console.error("Error saving profile:", err)
			setError(err instanceof Error ? err.message : t("account.failed"))
		}
	}

	if (loading || userLoading) {
		return (
			<Container
				size="md"
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
		<Container size="md" py="xl">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="lg">
					<Group justify="space-between">
						<Title order={1}>{t("account.title")}</Title>
						<Button component={Link} href="/dashboard" variant="subtle" leftSection={<IconArrowLeft size={16} />}>
							{t("account.back")}
						</Button>
					</Group>

					<Text c="dimmed" size="sm">
						{t("account.subtitle")}
					</Text>

					{error && (
						<Alert icon={<IconAlertCircle size={16} />} title={t("account.errorTitle")} color="red">
							{error}
						</Alert>
					)}

					{success && (
						<Alert icon={<IconCheck size={16} />} title={t("account.successTitle")} color="green">
							{success}
						</Alert>
					)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="md">
							<Group grow>
								<TextInput
									label={t("account.firstName")}
									{...register("name")}
									error={errors.name?.message}
									placeholder={t("account.firstNamePlaceholder")}
									leftSection={<IconUser size={16} />}
								/>
								<TextInput
									label={t("account.lastName")}
									{...register("surname")}
									error={errors.surname?.message}
									placeholder={t("account.lastNamePlaceholder")}
								/>
							</Group>

							<Controller
								name="birthdate"
								control={control}
								render={({ field }) => (
									<TextInput
										label={t("account.birthdate")}
										type="date"
										value={field.value ? field.value.toISOString().split("T")[0] : ""}
										onChange={e => {
											const dateValue = e.target.value ? new Date(e.target.value) : null
											field.onChange(dateValue)
										}}
										placeholder={t("account.birthdatePlaceholder")}
										max={new Date().toISOString().split("T")[0]}
										leftSection={<IconCalendar size={16} />}
										error={errors.birthdate?.message}
										styles={{
											input: {
												cursor: "pointer",
											},
										}}
									/>
								)}
							/>

							<Controller
								name="pronouns"
								control={control}
								render={({ field }) => (
									<Select
										label={t("account.pronouns")}
										value={field.value || ""}
										onChange={field.onChange}
										placeholder={t("account.pronounsPlaceholder")}
										data={pronounsOptions}
										clearable
										searchable
										error={errors.pronouns?.message}
									/>
								)}
							/>

							<Controller
								name="language"
								control={control}
								render={({ field }) => (
									<Select
										label={t("language.label")}
										value={field.value || ""}
										onChange={field.onChange}
										data={languageOptions}
										leftSection={<IconLanguage size={16} />}
										allowDeselect={false}
										aria-label={t("language.ariaLabel")}
										error={errors.language?.message}
									/>
								)}
							/>

							<TextInput
								label={t("account.city")}
								{...register("city")}
								error={errors.city?.message}
								placeholder={t("account.cityPlaceholder")}
							/>

							<Group justify="flex-end" mt="md">
								<Button type="submit" loading={isSubmitting} leftSection={<IconDeviceFloppy size={16} />}>
									{t("account.save")}
								</Button>
							</Group>
						</Stack>
					</form>
				</Stack>
			</Card>
		</Container>
	)
}
