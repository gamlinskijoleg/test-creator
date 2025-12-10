"use client"

import { useState } from "react"
import { Button, Group } from "@mantine/core"
import { IconShare, IconCopy, IconCheck } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

interface ShareButtonsProps {
	testId: string
	testTitle?: string
}

export function ShareButtons({ testId, testTitle }: ShareButtonsProps) {
	const [copied, setCopied] = useState(false)
	const { t } = useTranslation()

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
					title: testTitle || t("share.defaultTitle"),
					text: t("share.text", { title: testTitle || t("share.defaultTitle") }),
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
		<Group gap="xs">
			{canShare && (
				<Button variant="outline" onClick={handleShare} leftSection={<IconShare size={16} />}>
					{t("share.share")}
				</Button>
			)}
			<Button
				variant="outline"
				onClick={handleCopy}
				leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
			>
				{copied ? t("share.copied") : t("share.copy")}
			</Button>
		</Group>
	)
}
