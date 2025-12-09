"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import type { User } from "@supabase/supabase-js"

export default function AuthPage() {
	const router = useRouter()
	const [isSignUp, setIsSignUp] = useState(false)
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	})

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
			setLoading(false)
			if (session?.user) {
				router.push("/dashboard")
			}
		})
	}, [router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setMessage(null)
		setSubmitting(true)

		if (isSignUp) {
			if (formData.password !== formData.confirmPassword) {
				setError("Passwords do not match")
				setSubmitting(false)
				return
			}

			if (formData.password.length < 6) {
				setError("Password must be at least 6 characters")
				setSubmitting(false)
				return
			}

			try {
				const { data, error: signUpError } = await supabase.auth.signUp({
					email: formData.email,
					password: formData.password,
				})

				if (signUpError) {
					throw signUpError
				}

				if (data.user) {
					setMessage(
						"Account created successfully! Please check your email to verify your account.",
					)
					setFormData({ email: "", password: "", confirmPassword: "" })
				}
			} catch (err) {
				console.error("Sign up error:", err)
				setError(
					err instanceof Error ? err.message : "Failed to create account",
				)
			}
		} else {
			try {
				const { data, error: signInError } =
					await supabase.auth.signInWithPassword({
						email: formData.email,
						password: formData.password,
					})

				if (signInError) {
					throw signInError
				}

				if (data.user) {
					router.push("/dashboard")
				}
			} catch (err) {
				console.error("Sign in error:", err)
				setError(err instanceof Error ? err.message : "Failed to sign in")
			}
		}

		setSubmitting(false)
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-600 dark:text-gray-400">Loading...</div>
			</div>
		)
	}

	if (user) {
		return null // Will redirect
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<Card>
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							{isSignUp ? "Create Account" : "Welcome Back"}
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							{isSignUp
								? "Sign up to start creating tests"
								: "Sign in to your account"}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<Input
							label="Email"
							type="email"
							value={formData.email}
							onChange={e =>
								setFormData({ ...formData, email: e.target.value })
							}
							required
							placeholder="your@email.com"
						/>

						<Input
							label="Password"
							type="password"
							value={formData.password}
							onChange={e =>
								setFormData({ ...formData, password: e.target.value })
							}
							required
							placeholder="••••••••"
						/>

						{isSignUp && (
							<Input
								label="Confirm Password"
								type="password"
								value={formData.confirmPassword}
								onChange={e =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
								required
								placeholder="••••••••"
							/>
						)}

						{error && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<p className="text-sm text-red-600 dark:text-red-400">
									{error}
								</p>
							</div>
						)}

						{message && (
							<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
								<p className="text-sm text-green-600 dark:text-green-400">
									{message}
								</p>
							</div>
						)}

						<Button
							type="submit"
							variant="primary"
							disabled={submitting}
							className="w-full"
						>
							{submitting ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<button
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp)
								setError(null)
								setMessage(null)
								setFormData({
									email: "",
									password: "",
									confirmPassword: "",
								})
							}}
							className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
						>
							{isSignUp
								? "Already have an account? Sign in"
								: "Don't have an account? Sign up"}
						</button>
					</div>
				</Card>
			</div>
		</div>
	)
}
