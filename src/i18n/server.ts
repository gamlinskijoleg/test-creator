import { cookies, headers } from "next/headers"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./config"
import { getResourcesFor } from "./locales"

const normalizeLocale = (value?: string | null): Locale | undefined => {
	if (!value) return undefined
	return SUPPORTED_LOCALES.find(locale => locale === value)
}

const parseAcceptLanguage = (value: string | null): Locale | undefined => {
	if (!value) return undefined
	const locales = value
		.split(",")
		.map(part => part.split(";")[0]?.trim())
		.filter(Boolean)

	return normalizeLocale(locales.find(Boolean))
}

export const detectLocale = async (): Promise<Locale> => {
	const cookieStore = await cookies()
	const cookieLocale = normalizeLocale(cookieStore.get("locale")?.value)
	if (cookieLocale) return cookieLocale

	const headerStore = await headers()
	const headerLocale = parseAcceptLanguage(headerStore.get("accept-language"))
	if (headerLocale) return headerLocale

	return DEFAULT_LOCALE
}

export const getI18nProps = async () => {
	const locale = await detectLocale()
	const resources = getResourcesFor(locale)

	return { locale, resources }
}
