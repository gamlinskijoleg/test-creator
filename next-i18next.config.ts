/** @type {import('next-i18next').UserConfig} */
const config = {
	i18n: {
		defaultLocale: "en",
		locales: ["en", "uk"],
	},
	localePath: "./public/locales",
	defaultNS: "common",
}

module.exports = config

