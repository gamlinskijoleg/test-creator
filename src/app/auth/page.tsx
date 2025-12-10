"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn, signUp } from "@/lib/actions/auth"
import { useUser } from "@/lib/hooks/useUser"
import {
	Card,
	Title,
	Text,
	TextInput,
	PasswordInput,
	Button,
	Stack,
	Alert,
	Container,
	Loader,
	Anchor,
} from "@mantine/core"
import { IconAlertCircle, IconCheck } from "@tabler/icons-react"

const signInSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
})

const signUpSchema = signInSchema.extend({
	name: z.string().min(1, "Name is required"),
	confirmPassword: z.string().min(1, "Please confirm your password"),
})

type SignInFormData = z.infer<typeof signInSchema>
type SignUpFormData = z.infer<typeof signUpSchema>

export default function AuthPage() {
	const router = useRouter()
	const { user, loading } = useUser()
	const [isSignUp, setIsSignUp] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	const schema = useMemo(() => (isSignUp ? signUpSchema : signInSchema), [isSignUp])

	const {
		register,
		handleSubmit,
		watch,
		trigger,
		getValues,
		formState: { errors, isSubmitting, touchedFields },
		reset,
		clearErrors,
	} = useForm<SignInFormData | SignUpFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
			...(isSignUp && { name: "", confirmPassword: "" }),
		},
		mode: "onTouched",
		reValidateMode: "onChange",
		criteriaMode: "all",
	})

	// Watch password fields to trigger validation when they change
	const password = watch("password")
	const confirmPassword = watch("confirmPassword")

	// Trigger validation when passwords change
	useEffect(() => {
		if (isSignUp && (password || confirmPassword)) {
			trigger("confirmPassword")
		}
	}, [password, confirmPassword, isSignUp, trigger])

	useEffect(() => {
		clearErrors()
		reset({
			email: "",
			password: "",
			...(isSignUp && { name: "", confirmPassword: "" }),
		})
	}, [isSignUp, reset, clearErrors])

	useEffect(() => {
		if (user) {
			router.push("/dashboard")
		}
	}, [user, router])

	const onSubmit = async (data: SignInFormData | SignUpFormData) => {
		setError(null)
		setMessage(null)

		if (isSignUp) {
			const signUpData = data as SignUpFormData
			const result = await signUp(signUpData.email, signUpData.password, signUpData.name)

			if (!result.success) {
				setError(result.error || "Failed to create account")
			} else if (result.user) {
				setMessage("Account created successfully! Please check your email to verify your account.")
				reset()
			}
		} else {
			const signInData = data
			const result = await signIn(signInData.email, signInData.password)

			if (!result.success) {
				setError(result.error || "Failed to sign in")
			} else if (result.user) {
				// Refresh the page to update session
				router.refresh()
				router.push("/dashboard")
			}
		}
	}

	if (loading) {
		return (
			<Container
				size="sm"
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Loader />
			</Container>
		)
	}

	if (user) {
		return null // Will redirect
	}

	return (
		<Container size="sm" py="xl">
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="lg">
					<Stack gap="xs" align="center">
						<Title order={1} ta="center">
							{isSignUp ? "Create Account" : "Welcome Back"}
						</Title>
						<Text c="dimmed" ta="center">
							{isSignUp ? "Sign up to start creating tests" : "Sign in to your account"}
						</Text>
					</Stack>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack gap="md">
							{isSignUp && (
								<TextInput
									label="Name"
									{...register("name")}
									error={
										(touchedFields as Record<string, boolean>).name
											? (errors as Record<string, { message?: string }>).name?.message
											: undefined
									}
									required
									placeholder="Your name"
								/>
							)}

							<TextInput
								label="Email"
								type="email"
								{...register("email")}
								error={touchedFields.email ? errors.email?.message : undefined}
								required
								placeholder="your@email.com"
							/>

							<PasswordInput
								label="Password"
								{...register("password", {
									onChange: () => {
										if (isSignUp) {
											trigger("confirmPassword")
										}
									},
								})}
								error={touchedFields.password ? errors.password?.message : undefined}
								required
							/>

							{isSignUp && (
								<PasswordInput
									label="Confirm Password"
									{...register("confirmPassword", {
										validate: value => {
											if (!value) return "Please confirm your password"
											const currentPassword = getValues("password")
											if (currentPassword && value !== currentPassword) {
												return "Passwords do not match"
											}
											return true
										},
									})}
									error={
										(touchedFields as Record<string, boolean>).confirmPassword || confirmPassword
											? (errors as Record<string, { message: string }>).confirmPassword?.message
											: undefined
									}
									required
								/>
							)}

							{error && (
								<Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
									{error}
								</Alert>
							)}

							{message && (
								<Alert icon={<IconCheck size={16} />} title="Success" color="green">
									{message}
								</Alert>
							)}

							<Button type="submit" disabled={isSubmitting} loading={isSubmitting} fullWidth>
								{isSignUp ? "Sign Up" : "Sign In"}
							</Button>
						</Stack>
					</form>

					<Text ta="center" size="sm">
						{isSignUp ? "Already have an account? " : "Don't have an account? "}
						<Anchor
							component="button"
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp)
								setError(null)
								setMessage(null)
								clearErrors()
								reset()
							}}
						>
							{isSignUp ? "Sign in" : "Sign up"}
						</Anchor>
					</Text>
				</Stack>
			</Card>
		</Container>
	)
}
