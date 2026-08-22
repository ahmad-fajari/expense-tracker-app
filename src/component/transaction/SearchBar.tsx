import { Show } from "solid-js";
import Button from "../ui/Button";

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
			data-testid="searchTransactionForm"
			class="grid grid-cols-[1fr_auto] tracker-search"
			onSubmit={handleSubmit}
			novalidate>
			<div class="relative">
				<input
					type="search"
					id="searchTransactionFormTitleInput"
					data-testid="searchTransactionFormTitleInput"
					class="tracker-search__input tracker-input"
					placeholder="Cari transaksi berdasarkan judul..."
					required
					aria-label="Kata kunci pencarian transaksi"
					value={props.value}
					onInput={(e) => props.onInput(e.currentTarget.value)}
				/>
				<Show when={props.value !== ""}>
					<Button
						variant="action"
						id="clear-button"
						class="tracker-search__submit"
						aria-label="Bersihkan pencarian"
						title="Bersihkan pencarian"
						onClick={props.onClear}>
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 640">
							<path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
						</svg>
					</Button>
				</Show>
			</div>
			<button
				type="submit"
				data-testid="searchTransactionFormSubmitButton"
				class="tracker-search__submit"
				aria-label="Mulai Pencarian"
				title="Mulai pencarian">
				<svg
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 640 640">
					<path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
				</svg>
			</button>
		</form>
	);
}
