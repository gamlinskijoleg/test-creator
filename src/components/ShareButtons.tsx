"use client"

import { useState } from "react"
import { Button } from "./ui/Button"

interface ShareButtonsProps {
	testId: string
	testTitle?: string
}

export function ShareButtons({ testId, testTitle }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false)

	const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/test/${testId}`

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy:", err)
		}
	}

	const handleShare = async () => {
		if (typeof navigator !== "undefined" && "share" in navigator) {
			try {
				await navigator.share({
					title: testTitle || "Test",
					text: `Take this test: ${testTitle || "Test"}`,
					url: shareUrl,
				})
			} catch (err) {
				// User cancelled or error occurred
				if ((err as Error).name !== "AbortError") {
					console.error("Error sharing:", err)
				}
			}
		}
	}

	const canShare = typeof navigator !== "undefined" && "share" in navigator

	return (
		<div className="flex items-center gap-2">
			{canShare && (
				<Button
					variant="outline"
					onClick={handleShare}
					className="flex items-center gap-2"
				>
					<img
						src="/icons/share.svg"
						alt="Share"
						className="w-4 h-4"
					/>
					Share
				</Button>
			)}
			<Button
				variant="outline"
				onClick={handleCopy}
				className="flex items-center gap-2"
			>
				<img
					src="/icons/copy.svg"
					alt="Copy"
					className="w-4 h-4"
				/>
				{copied ? "Copied!" : "Copy Link"}
			</Button>
		</div>
	)
}

