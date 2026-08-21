// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare(),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [solidJs()],

	fonts: [
		{
			name: "Outfit",
			cssVariable: "--font-outfit",
			provider: fontProviders.fontsource(),
			weights: ["100 900"],
			fallbacks: ["sans-serif"],
		},
	],
});
