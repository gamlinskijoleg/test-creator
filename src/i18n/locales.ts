import type { Resource } from "i18next"

import enCommon from "../../public/locales/en/common.json"
import ukCommon from "../../public/locales/uk/common.json"
import type { Locale } from "./config"

export const resources = {
	en: { common: enCommon },
	uk: { common: ukCommon },
} satisfies Resource

export const getResourcesFor = (locale: Locale): Resource => ({
	[locale]: resources[locale],
})
