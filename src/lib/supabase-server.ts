import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Get user session on server
// Note: This is a simplified approach. For production, consider using @supabase/ssr
export async function getServerSession() {
	if (!supabaseUrl || !supabaseAnonKey) {
		return null
	}

	const headersList = await headers()
	const cookieHeader = headersList.get("cookie") || ""

	// Extract Supabase session from cookies
	// Supabase stores session in cookies with pattern: sb-<project-ref>-auth-token
	const projectRef = supabaseUrl.split("//")[1]?.split(".")[0]
	if (!projectRef) {
		return null
	}

	const cookieName = `sb-${projectRef}-auth-token`
	const cookieMatch = cookieHeader.match(new RegExp(`${cookieName}=([^;]+)`))

	if (!cookieMatch) {
		return null
	}

	try {
		// Decode the session cookie (it's base64 encoded JSON)
		const sessionData = JSON.parse(
			Buffer.from(cookieMatch[1], "base64").toString("utf-8"),
		)

		if (!sessionData?.access_token) {
			return null
		}

		// Create a client with the access token
		const supabaseServer = createClient<Database>(
			supabaseUrl,
			supabaseAnonKey,
			{
				global: {
					headers: {
						Authorization: `Bearer ${sessionData.access_token}`,
					},
				},
			},
		)

		// Verify the token and get user
		const {
			data: { user },
			error,
		} = await supabaseServer.auth.getUser(sessionData.access_token)

		if (error || !user) {
			return null
		}

		// Return a session-like object
		return {
			access_token: sessionData.access_token,
			refresh_token: sessionData.refresh_token,
			user,
			expires_at: sessionData.expires_at,
			expires_in: sessionData.expires_in,
			token_type: "bearer",
		}
	} catch (error) {
		console.error("Error parsing session cookie:", error)
		return null
	}
}
