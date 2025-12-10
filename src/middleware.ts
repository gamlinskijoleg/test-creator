import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(request: NextRequest) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!supabaseUrl || !supabaseAnonKey) {
		console.error("Missing Supabase environment variables")
		return NextResponse.next()
	}

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})

	// Create Supabase client for middleware
	const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					request.cookies.set(name, value)
					response.cookies.set(name, value, options)
				})
			},
		},
	})

	// Handle email confirmation code
	const code = request.nextUrl.searchParams.get("code")
	if (code) {
		try {
			// Create redirect response first so cookies can be set on it
			const redirectUrl = new URL("/dashboard", request.url)
			const redirectResponse = NextResponse.redirect(redirectUrl)

			// Create a new Supabase client that uses the redirect response for cookies
			const supabaseWithRedirect = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
				cookies: {
					getAll() {
						return request.cookies.getAll()
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) => {
							request.cookies.set(name, value)
							redirectResponse.cookies.set(name, value, options)
						})
					},
				},
			})

			const { data, error } = await supabaseWithRedirect.auth.exchangeCodeForSession(code)

			if (!error && data?.user) {
				return redirectResponse
			}
		} catch (error) {
			console.error("Error exchanging code for session:", error)
			// Continue to the page even if there's an error
		}
	}

	// Refresh session for authenticated routes
	await supabase.auth.getUser()

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
}
