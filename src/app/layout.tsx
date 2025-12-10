import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@mantine/core/styles.css"
import "./globals.css"
import {
	MantineProvider,
	ColorSchemeScript,
	AppShell,
	AppShellHeader,
	AppShellMain,
	AppShellFooter,
	createTheme,
} from "@mantine/core"
import { I18nProvider } from "@/components/I18nProvider"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { StructuredData } from "@/components/StructuredData"
import { getI18nProps } from "@/i18n/server"
import { defaultMetadata } from "@/lib/metadata"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = defaultMetadata

const theme = createTheme({
	primaryColor: "blue",
	defaultRadius: "md",
	fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	headings: {
		fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	},
	colors: {
		dark: [
			"#ffffff",
			"#f5f5f5",
			"#e0e0e0",
			"#b0b0b0",
			"#808080",
			"#505050",
			"#303030",
			"#202020",
			"#000000",
			"#000000",
		],
	},
})

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const { locale, resources } = await getI18nProps()

	return (
		<html lang={locale} suppressHydrationWarning data-mantine-color-scheme="dark">
			<head>
				<ColorSchemeScript defaultColorScheme="dark" />
				<StructuredData />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<I18nProvider locale={locale} resources={resources}>
					<MantineProvider theme={theme} defaultColorScheme="dark">
						<AppShell padding={0} header={{ height: 70 }} footer={{ height: "auto" }}>
							<AppShellHeader withBorder style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
								<Navbar />
							</AppShellHeader>
							<AppShellMain style={{ minHeight: "calc(100vh - 70px)", position: "relative", zIndex: 1 }}>
								{children}
							</AppShellMain>
							<AppShellFooter withBorder style={{ marginTop: "auto", position: "relative", zIndex: 1 }}>
								<Footer />
							</AppShellFooter>
						</AppShell>
					</MantineProvider>
				</I18nProvider>
			</body>
		</html>
	)
}
