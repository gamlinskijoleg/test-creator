"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
} from "@tabler/icons-react"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"

const pronounsOptions = [
	{ value: "he/him", label: "He/Him" },
	{ value: "she/her", label: "She/Her" },
	{ value: "they/them", label: "They/Them" },
	{ value: "other", label: "Other" },
	{ value: "prefer-not-to-say", label: "Prefer not to say" },
]

const accountSchema = z.object({
	name: z.string().optional(),
	surname: z.string().optional(),
	birthdate: z.date().nullable().optional(),
	pronouns: z.string().optional(),
	city: z.string().optional(),
})

type AccountFormData = z.infer<typeof accountSchema>

export default function AccountPage() {
	const router = useRouter()
	const { user, loading: userLoading } = useUser()
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
		},
	})

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
			})

			if (!result.success) {
				setError(result.error || "Failed to save profile")
			} else {
				setSuccess("Profile saved successfully!")
			}
		} catch (err) {
			console.error("Error saving profile:", err)
			setError(err instanceof Error ? err.message : "Failed to save profile")
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
						<Title order={1}>Account Settings</Title>
						<Button component={Link} href="/dashboard" variant="subtle" leftSection={<IconArrowLeft size={16} />}>
							Back
						</Button>
					</Group>

					<Text c="dimmed" size="sm">
						Manage your account information and preferences.
					</Text>

					{error && (
						<Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
							{error}
						</Alert>
					)}

					{success && (
						<Alert icon={<IconCheck size={16} />} title="Success" color="green">
							{success}
						</Alert>
					)}

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="md">
							<Group grow>
								<TextInput
									label="First Name"
									{...register("name")}
									error={errors.name?.message}
									placeholder="Enter your first name"
									leftSection={<IconUser size={16} />}
								/>
								<TextInput
									label="Last Name"
									{...register("surname")}
									error={errors.surname?.message}
									placeholder="Enter your last name"
								/>
							</Group>

							<Controller
								name="birthdate"
								control={control}
								render={({ field }) => (
									<TextInput
										label="Birthdate"
										type="date"
										value={field.value ? field.value.toISOString().split("T")[0] : ""}
										onChange={e => {
											const dateValue = e.target.value ? new Date(e.target.value) : null
											field.onChange(dateValue)
										}}
										placeholder="Select your birthdate"
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
										label="Pronouns"
										value={field.value || ""}
										onChange={field.onChange}
										placeholder="Select your pronouns"
										data={pronounsOptions}
										clearable
										searchable
										error={errors.pronouns?.message}
									/>
								)}
							/>

							<TextInput
								label="City"
								{...register("city")}
								error={errors.city?.message}
								placeholder="Enter your city"
							/>

							<Group justify="flex-end" mt="md">
								<Button type="submit" loading={isSubmitting} leftSection={<IconDeviceFloppy size={16} />}>
									Save Changes
								</Button>
							</Group>
						</Stack>
					</form>
				</Stack>
			</Card>
		</Container>
	)
}
