export const SUPPORTED_LOCALES = ["en", "uk"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const DEFAULT_NAMESPACE = "common"
