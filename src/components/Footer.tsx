import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Test Creator
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Create and share interactive tests and quizzes with ease.
						</p>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
							Navigation
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard"
									className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
								>
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									href="/create"
									className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
								>
									Create Test
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
							Account
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									href="/auth"
									className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
								>
									Sign In
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
					<p>© {new Date().getFullYear()} Test Creator. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
