"use client"

import { I18nextProvider } from "react-i18next"
import { useMemo } from "react"
import type { Resource } from "i18next"

import { initI18n } from "@/i18n/init"
import type { Locale } from "@/i18n/config"

export function I18nProvider({
	locale,
	resources,
	children,
}: {
	locale: Locale
	resources: Resource
	children: React.ReactNode
}) {
	const i18n = useMemo(() => initI18n(locale, resources), [locale, resources])

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

