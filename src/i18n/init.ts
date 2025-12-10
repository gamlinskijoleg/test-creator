import { createInstance, type Resource } from "i18next"
import { initReactI18next } from "react-i18next"

import { DEFAULT_LOCALE, DEFAULT_NAMESPACE, SUPPORTED_LOCALES, type Locale } from "./config"

export const initI18n = (locale: Locale, resources: Resource) => {
	const instance = createInstance()

	instance.use(initReactI18next).init({
		lng: locale,
		fallbackLng: DEFAULT_LOCALE,
		supportedLngs: SUPPORTED_LOCALES,
		defaultNS: DEFAULT_NAMESPACE,
		ns: [DEFAULT_NAMESPACE],
		resources,
		interpolation: {
			escapeValue: false,
		},
	})

	return instance
}
