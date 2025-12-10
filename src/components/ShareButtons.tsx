"use client"

import { useEffect, useMemo, useState } from "react"
import { Button, Group } from "@mantine/core"
import { IconShare, IconCopy, IconCheck } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

type BaseProps = {
	testId: string
	testTitle?: string
	iconOnly?: boolean
}

export function ShareButton({ testId, testTitle, iconOnly = false }: BaseProps) {
	const { t } = useTranslation()
	const [canShare, setCanShare] = useState(false)

	const shareUrl = useMemo(
		() => `${typeof window !== "undefined" ? window.location.origin : ""}/test/${testId}`,
		[testId],
	)

	useEffect(() => {
		setCanShare(typeof navigator !== "undefined" && "share" in navigator)
	}, [])

	if (!canShare) return null

	const handleShare = async () => {
		try {
			await navigator.share({
				title: testTitle || t("share.defaultTitle"),
				text: t("share.text", { title: testTitle || t("share.defaultTitle") }),
				url: shareUrl,
			})
		} catch (err) {
			if ((err as Error).name !== "AbortError") {
				console.error("Error sharing:", err)
			}
		}
	}

	return (
		<Button
			variant={iconOnly ? "subtle" : "outline"}
			onClick={handleShare}
			leftSection={<IconShare size={16} />}
			aria-label={t("share.share")}
			title={t("share.share")}
			px={iconOnly ? "xs" : undefined}
			size={iconOnly ? "sm" : "md"}
		>
			{iconOnly ? null : t("share.share")}
		</Button>
	)
}

export function CopyLinkButton({ testId, iconOnly = false }: BaseProps) {
	const [copied, setCopied] = useState(false)
	const { t } = useTranslation()

	const shareUrl = useMemo(
		() => `${typeof window !== "undefined" ? window.location.origin : ""}/test/${testId}`,
		[testId],
	)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy:", err)
		}
	}

	return (
		<Button
			variant={iconOnly ? "subtle" : "outline"}
			onClick={handleCopy}
			leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
			aria-label={copied ? t("share.copied") : t("share.copy")}
			title={copied ? t("share.copied") : t("share.copy")}
			px={iconOnly ? "xs" : undefined}
			size={iconOnly ? "sm" : "md"}
		>
			{iconOnly ? null : copied ? t("share.copied") : t("share.copy")}
		</Button>
	)
}

export function ShareButtonsGroup({ testId, testTitle, iconOnly = false }: BaseProps) {
	return (
		<Group gap="xs">
			<ShareButton testId={testId} testTitle={testTitle} iconOnly={iconOnly} />
			<CopyLinkButton testId={testId} testTitle={testTitle} iconOnly={iconOnly} />
		</Group>
	)
}
