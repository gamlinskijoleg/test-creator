import { getServerSession } from "@/lib/supabase-server"
import { CreateTestForm } from "@/components/CreateTestForm"
import { Card } from "@/components/ui/Card"

export default async function CreateTestPage() {
	const session = await getServerSession()
	const user = session?.user ?? null

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<h1 className="text-2xl font-bold mb-4">Please sign in</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						You need to be signed in to create a test.
					</p>
				</Card>
			</div>
		)
	}

	return <CreateTestForm user={user} />
}
