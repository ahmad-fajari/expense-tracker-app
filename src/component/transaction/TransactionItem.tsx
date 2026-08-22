import { ArrowRightLeft, MoveDownLeft, SquarePen, Trash2 } from "lucide-solid";

import type { Transaction } from "~/types";
import { classList } from "~/utils/class-list";

import Button from "../ui/Button";

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
			class="items-center gap-x-8 grid @min-[32rem]:grid-cols-[1fr_auto] border-border-muted not-last:border-be pbe-3 not-last:mbe-3"
			data-transaction-id={props.transaction.id}>
			{/* detail transaksi wrapper */}
			<div class="@min-[23rem]:justify-items-end items-center gap-4 grid @min-[23rem]:grid-cols-[auto_auto_5.5rem] grow">
				{/* judul / keterangan */}
				<h3
					data-testid="transactionItemTitle"
					class="flex @min-[23rem]:justify-self-start items-center gap-2 font-semibold"
					aria-label="Detail transaction">
					<MoveDownLeft
						class={classList(
							"transaction-icon",
							isIncome() ? "income" : "icon-expense expense",
						)}
					/>
					<span id="transaction-item-title">{props.transaction.title}</span>
				</h3>
				{/* nominal */}
				<span
					data-testid="transactionItemAmount"
					class={classList(
						"font-bold text-[1.1rem]",
						isIncome() ? "income" : "expense",
					)}>
					{formatCurrency(props.transaction.amount)}
				</span>
				{/* tanggal */}
				<span
					data-testid="transactionItemDate"
					class="text-[0.8rem] text-text-muted">
					{props.transaction.date}
				</span>
				{/* klasifikasi */}
				<span data-testid="transactionItemType" class="visually-hidden">
					{props.transaction.type}
				</span>
			</div>

			{/* button wrapper */}
			<div class="flex min-[32rem]:flex-row flex-wrap justify-center justify-self-end gap-3 min-[40rem]:gap-1">
				{/* edit button */}
				<Button
					variant="action"
					id="edit-button"
					aria-label="Edit Transaksi"
					title="Edit Transaksi"
					onClick={() => props.onEdit(props.transaction)}>
					<SquarePen class="inline-6" />
				</Button>

				{/* ubah transaksi button */}
				<Button
					variant="action"
					data-testid="transactionItemEditTypeButton"
					aria-label="Ubah Tipe Transaksi"
					title="Ubah Tipe Transaksi"
					onClick={() => props.onToggleType(props.transaction.id)}>
					<ArrowRightLeft class="inline-6" />
				</Button>

				{/* hapus transaksi button */}
				<Button
					variant="delete"
					data-testid="transactionItemDeleteButton"
					aria-label="Hapus Transaksi"
					title="Hapus Transaksi"
					onClick={() => props.onDelete(props.transaction.id)}>
					<Trash2 class="inline-6" />
				</Button>
			</div>
		</section>
	);
}
