import { type ReactNode } from "react"

interface ButtonProps {
	children: ReactNode
	onClick?: () => void
	type?: "button" | "submit" | "reset"
	variant?: "primary" | "secondary" | "danger" | "outline"
	disabled?: boolean
	className?: string
}

export function Button({
	children,
	onClick,
	type = "button",
	variant = "primary",
	disabled = false,
	className = "",
}: ButtonProps) {
	const baseStyles =
		"px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
	const variants = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
		secondary:
			"bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
		danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
		outline:
			"border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${className}`}
		>
			{children}
		</button>
	)
}
