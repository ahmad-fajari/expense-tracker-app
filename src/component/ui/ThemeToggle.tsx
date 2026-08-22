import { createSignal, onMount, createEffect, Show } from "solid-js";
import { Laptop, Moon, Sun } from "lucide-solid";

import Button from "~/component/ui/Button";
import { classList } from "~/utils/class-list";

type Theme = "light" | "dark" | "auto";

export default function ThemeToggle() {
	const [theme, setThemeState] = createSignal<Theme>("auto");

	// set theme state setelah hidrasi
	onMount(() => {
		const savedTheme = localStorage.getItem("theme") as Theme;
		setThemeState(savedTheme);
	});

	// set data-theme attribute
	createEffect(() => {
		document.documentElement.setAttribute("data-theme", theme());
	});

	return (
		<>
			<Button
				variant="outline"
				popoverTarget="theme-dropdown"
				class="flex items-center gap-2 px-3 rounded-lg h-10 text-sm anchor-theme-dropdown-button">
				<span>Theme:</span>
				<span class="flex items-center">
					<Show when={theme() === "light"}>
						<Sun class="block-4 inline-4" />
					</Show>
					<Show when={theme() === "dark"}>
						<Moon class="block-4 inline-4" />
					</Show>
					<Show when={theme() === "auto"}>
						<Laptop class="block-4 inline-4" />
					</Show>
				</span>
			</Button>

			<div
				id="theme-dropdown"
				popover
				class="z-50 bg-bg-card shadow-elevation-medium p-1 border border-border rounded-xl position-dropdown-popover">
				<button
					type="button"
					onClick={() => setThemeState("light")}
					class={classList(
						"flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full hover:text-primary-text text-sm text-left transition-colors duration-150 cursor-pointer mbe-1",
						theme() === "light"
							? "text-primary-text font-semibold bg-bg-surface"
							: "text-text-muted",
					)}>
					<Sun class="w-4 h-4" />
					<span>Light</span>
				</button>
				<button
					type="button"
					onClick={() => setThemeState("dark")}
					class={classList(
						"flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full hover:text-primary-text text-sm text-left transition-colors duration-150 cursor-pointer mbe-1",
						theme() === "dark"
							? "text-primary-text font-semibold bg-bg-surface"
							: "text-text-muted",
					)}>
					<Moon class="w-4 h-4" />
					<span>Dark</span>
				</button>
				<button
					type="button"
					onClick={() => setThemeState("auto")}
					class={classList(
						"flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full hover:text-primary-text text-sm text-left transition-colors duration-150 cursor-pointer mbe-1",
						theme() === "auto"
							? "text-primary-text font-semibold bg-bg-surface"
							: "text-text-muted",
					)}>
					<Laptop class="w-4 h-4" />
					<span>Auto</span>
				</button>
			</div>
		</>
	);
}
