import { Show } from "solid-js";
import { Search, X } from "lucide-solid";

interface SearchBarProps {
	value: string;
	onInput: (value: string) => void;
	onClear: () => void;
}

export default function SearchBar(props: SearchBarProps) {
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
	};

	return (
		<form
			id="searchTransactionForm"
			class="group grid grid-cols-[1fr_auto]"
			onSubmit={handleSubmit}
			novalidate>
			<div class="relative">
				<input
					type="search"
					id="searchTransactionFormTitleInput"
					class="group-focus-within:search-input-shadow group-hover:search-input-shadow pe-8 border-e-0 group-focus-within:border-secondary group-hover:border-secondary rounded-ss-[12px] rounded-es-[12px] group-focus-within:outline-none transition-[border-color,box-shadow] duration-200 ease-in-out [&::-webkit-search-cancel-button]:appearance-none tracker-input"
					placeholder="Cari transaksi berdasarkan judul..."
					required
					aria-label="Cari transaksi"
					value={props.value}
					onInput={(e) => props.onInput(e.currentTarget.value)}
				/>
				<Show when={props.value !== ""}>
					<button
						type="button"
						id="clear-button"
						class="absolute inset-y-0 flex justify-center items-center px-2 text-text-muted hover:text-text focus-visible:text-text transition-colors transition-discrete duration-1000 ease-in-out cursor-pointer end-0"
						aria-label="Bersihkan pencarian"
						title="Bersihkan pencarian"
						onClick={props.onClear}>
						<X class="block-4 inline-4" />
					</button>
				</Show>
			</div>
			<button
				type="submit"
				class="flex justify-center items-center bg-bg-card hover:bg-secondary-hover focus-visible:bg-secondary-hover group-focus-within:search-button-shadow group-hover:search-button-shadow border border-border border-s-0 group-focus-within:border-secondary group-hover:border-secondary rounded-se-[12px] rounded-ee-[12px] w-12 font-semibold text-text-muted hover:text-text-dark focus-visible:text-text-dark transition-all duration-200 ease-in-out cursor-pointer"
				aria-label="Mulai Pencarian"
				title="Mulai pencarian">
				<Search class="block-6 inline-6" />
			</button>
		</form>
	);
}
