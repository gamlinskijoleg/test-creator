import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const siteName = "Testy"
const siteDescription =
	"Build interactive quizzes and tests with ease. Share them with others and track results in real-time. Create engaging assessments for education, training, or fun."

export const defaultMetadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${siteName} - Create & Take Interactive Tests`,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	keywords: [
		"test creator",
		"quiz maker",
		"online tests",
		"interactive quizzes",
		"test builder",
		"assessment tool",
		"quiz platform",
		"test sharing",
		"online assessment",
		"test results",
		"quiz generator",
		"testy",
	],
	authors: [{ name: siteName }],
	creator: siteName,
	publisher: siteName,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		siteName,
		title: `${siteName} - Create & Take Interactive Tests`,
		description:
			"Build interactive quizzes and tests with ease. Share them with others and track results in real-time.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: `${siteName} - Create & Take Interactive Tests`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} - Create & Take Interactive Tests`,
		description:
			"Build interactive quizzes and tests with ease. Share them with others and track results in real-time.",
		images: ["/og-image.png"],
		creator: "@testy",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "PJPbuCHJfoyojLi6kG_ERB8U0mQxpMAM8gVfr4GZPIY",
		// Add your verification codes here when available
		// google: "your-google-verification-code",
		// yandex: "your-yandex-verification-code",
		// bing: "your-bing-verification-code",
	},
	alternates: {
		canonical: "/",
	},
	category: "education",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/manifest.json",
	other: {
		"theme-color": "#000000",
		"color-scheme": "dark",
	},
}

export const structuredData = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: siteName,
	description: "Build interactive quizzes and tests with ease. Share them with others and track results in real-time.",
	url: siteUrl,
	applicationCategory: "EducationalApplication",
	operatingSystem: "Web",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	aggregateRating: {
		"@type": "AggregateRating",
		ratingValue: "5",
		ratingCount: "1",
	},
}
