"use client"

import { useCallback, useMemo } from "react"

import { Select } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

import { SUPPORTED_LOCALES, type Locale } from "@/i18n/config"

export function LanguageSwitcher() {
	const router = useRouter()
	const { i18n, t } = useTranslation()

	const options = useMemo(
		() =>
			SUPPORTED_LOCALES.map((value) => ({
				value,
				label: t(`language.${value}`),
			})),
		[t],
	)

	const handleChange = useCallback(
		(value: string | null) => {
			const nextLocale = (value ?? i18n.language) as Locale
			document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`
			router.refresh()
		},
		[i18n.language, router],
	)

	return (
		<Select
			size="xs"
			aria-label={t("language.ariaLabel")}
			label={t("language.label")}
			value={i18n.language}
			data={options}
			onChange={handleChange}
			allowDeselect={false}
			style={{ width: 180 }}
			withCheckIcon={false}
		/>
	)
}

