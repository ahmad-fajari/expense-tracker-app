import { createSignal, onCleanup, onMount } from "solid-js";

export function createUrlParams(key: string, defaultValue: string = "") {
	const [value, setValue] = createSignal(defaultValue);

	// Ambil nilai awal saat client-side hydration dimulai
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		setValue(params.get(key) || defaultValue);

		// Dengarkan jika user menekan tombol Back/Forward di browser
		const handlePopState = () => {
			const updatedParams = new URLSearchParams(window.location.search);
			setValue(updatedParams.get(key) || defaultValue);
		};

		window.addEventListener("popstate", handlePopState);
		onCleanup(() => window.removeEventListener("popstate", handlePopState));
	});

	// Fungsi untuk mengubah nilai di state sekaligus memperbarui URL browser
	const setParam = (newValue: string) => {
		setValue(newValue);
		const params = new URLSearchParams(window.location.search);

		if (newValue) {
			params.set(key, newValue);
		} else {
			params.delete(key); // Hapus dari URL jika string kosong
		}

		// Perbarui URL tanpa me-reload halaman
		const queryString = params.toString();
		const newUrl = queryString
			? `${window.location.pathname}?${queryString}`
			: window.location.pathname;
		window.history.replaceState({}, "", newUrl);
	};

	return [value, setParam] as const;
}
