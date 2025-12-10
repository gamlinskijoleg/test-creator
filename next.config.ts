import type { NextConfig } from "next"
import nextI18NextConfig from "./next-i18next.config.js"

const nextConfig: NextConfig = {
	reactCompiler: true,
	i18n: nextI18NextConfig.i18n,
}

export default nextConfig
