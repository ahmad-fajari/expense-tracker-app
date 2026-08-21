// @ts-check
import { defineConfig } from "astro/config";

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
});
