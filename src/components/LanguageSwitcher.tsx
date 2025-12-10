"use client"

import { useCallback, useMemo, useState } from "react"

import { Loader, Select } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

import { supabaseClient } from "@/lib/supabase-client"
import { useUser } from "@/lib/hooks/useUser"
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/config"

export function LanguageSwitcher() {
	const router = useRouter()
	const { user } = useUser()
	const { i18n, t } = useTranslation()
	const [saving, setSaving] = useState(false)

	const flagMap: Record<Locale, string> = {
		en: "🇺🇸",
		uk: "🇺🇦",
	}

	const options = useMemo(
		() =>
			SUPPORTED_LOCALES.map(value => ({
				value,
				label: `${flagMap[value]} ${t(`language.${value}`)}`,
			})),
		[t],
	)

	const handleChange = useCallback(
		async (value: string | null) => {
			const nextLocale = (value ?? i18n.language) as Locale
			document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`

			if (user?.id) {
				try {
					setSaving(true)
					await supabaseClient
						.from("profiles")
						.upsert(
							{ user_id: user.id, language: nextLocale, updated_at: new Date().toISOString() },
							{ onConflict: "user_id" },
						)
				} catch (error) {
					console.error("Failed to save language preference:", error)
				} finally {
					setSaving(false)
				}
			}

			await i18n.changeLanguage(nextLocale)
			router.refresh()
		},
		[i18n, router, user?.id],
	)

	return (
		<Select
			size="xs"
			aria-label={t("language.ariaLabel")}
			label={t("language.label")}
			value={i18n.language}
			data={options}
			onChange={handleChange}
			rightSection={saving ? <Loader size="xs" /> : undefined}
			allowDeselect={false}
			style={{ width: 180 }}
			withCheckIcon={false}
		/>
	)
}
