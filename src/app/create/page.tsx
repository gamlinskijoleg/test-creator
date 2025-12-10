import { getSession } from "@/lib/actions/auth"
import { CreateTestForm } from "@/components/CreateTestForm"
import { UnauthenticatedMessage } from "@/components/UnauthenticatedMessage"

// Force dynamic rendering since we use cookies for authentication
export const dynamic = "force-dynamic"

export default async function CreateTestPage() {
	const { user } = await getSession()

	if (!user) {
		return <UnauthenticatedMessage />
	}

	return <CreateTestForm userId={user.id} />
}
