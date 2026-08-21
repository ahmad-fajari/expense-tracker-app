import type { Transaction } from "~/types";

interface TransactionItemProps {
	transaction: Transaction;
	onEdit: (transaction: Transaction) => void;
	onDelete: (id: string) => void;
	onToggleType: (id: string) => void;
}

export default function TransactionItem(props: TransactionItemProps) {
	const formatCurrency = (amount: number) => {
		return `Rp. ${amount.toLocaleString("id-ID")}`;
	};

	const isIncome = () => props.transaction.type === "income";

	return (
		<section
			data-testid="transactionItem"
			class="tracker-transaction-item"
			data-transaction-id={props.transaction.id}>
			{/* detail transaksi wrapper */}
			<div class="tracker-transaction-item__detail">
				{/* judul / keterangan */}
				<h3
					data-testid="transactionItemTitle"
					class="tracker-transaction-item__title"
					aria-label="Detail transaction">
					<svg
						id="transaction-icon"
						class={`tracker-transaction-icon ${
							isIncome()
								? "income"
								: "tracker-transaction-icon--expense expense"
						}`}
						aria-hidden="true"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960">
						<path d="M192.59-192.11v-411h91v256.35l460.89-460.89L808.13-744 347.24-283.11h256.35v91h-411Z" />
					</svg>
					<span id="transaction-item-title">{props.transaction.title}</span>
				</h3>
				{/* nominal */}
				<span
					data-testid="transactionItemAmount"
					class={`tracker-transaction-item__amount ${
						isIncome() ? "income" : "expense"
					}`}>
					{formatCurrency(props.transaction.amount)}
				</span>
				{/* tanggal */}
				<span
					data-testid="transactionItemDate"
					class="tracker-transaction-item__date">
					{props.transaction.date}
				</span>
				{/* klasifikasi */}
				<span data-testid="transactionItemType" class="visually-hidden">
					{props.transaction.type}
				</span>
			</div>

			{/* button wrapper */}
			<div class="tracker-transaction-item__actions">
				{/* edit button */}
				<button
					type="button"
					id="edit-button"
					class="tracker-transaction-item__btn action-button"
					aria-label="Edit Transaksi"
					title="Edit Transaksi"
					onClick={() => props.onEdit(props.transaction)}>
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640">
						<path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z" />
					</svg>
				</button>

				{/* ubah transaksi button */}
				<button
					type="button"
					data-testid="transactionItemEditTypeButton"
					class="tracker-transaction-item__btn action-button"
					aria-label="Ubah Tipe Transaksi"
					title="Ubah Tipe Transaksi"
					onClick={() => props.onToggleType(props.transaction.id)}>
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640">
						<path d="M566.6 214.6L470.6 310.6C458.1 323.1 437.8 323.1 425.3 310.6C412.8 298.1 412.8 277.8 425.3 265.3L466.7 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L466.7 160L425.3 118.6C412.8 106.1 412.8 85.8 425.3 73.3C437.8 60.8 458.1 60.8 470.6 73.3L566.6 169.3C579.1 181.8 579.1 202.1 566.6 214.6zM169.3 566.6L73.3 470.6C60.8 458.1 60.8 437.8 73.3 425.3L169.3 329.3C181.8 316.8 202.1 316.8 214.6 329.3C227.1 341.8 227.1 362.1 214.6 374.6L173.3 416L544 416C561.7 416 576 430.3 576 448C576 465.7 561.7 480 544 480L173.3 480L214.7 521.4C227.2 533.9 227.2 554.2 214.7 566.7C202.2 579.2 181.9 579.2 169.4 566.7z" />
					</svg>
				</button>

				{/* hapus transaksi button */}
				<button
					type="button"
					data-testid="transactionItemDeleteButton"
					class="tracker-transaction-item__btn delete-button"
					aria-label="Hapus Transaksi"
					title="Hapus Transaksi"
					onClick={() => props.onDelete(props.transaction.id)}>
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640">
						<path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
					</svg>
				</button>
			</div>
		</section>
	);
}
