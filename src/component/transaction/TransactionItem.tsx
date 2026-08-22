import {
	ArrowRightLeft,
	EllipsisVertical,
	MoveDownLeft,
	SquarePen,
	Trash2,
} from "lucide-solid";

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
	let popoverRef: HTMLDivElement | undefined;

	const formatCurrency = (amount: number) => {
		return `Rp. ${amount.toLocaleString("id-ID")}`;
	};

	const isIncome = () => props.transaction.type === "income";

	return (
		<section
			data-testid="transactionItem"
			class="items-center gap-x-8 grid grid-cols-[1fr_auto] border-border-muted not-last:border-be pbe-3 not-last:mbe-3"
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
			<div class="flex justify-end justify-self-end">
				{/* dropdown trigger button */}
				<Button
					variant="action"
					popoverTarget={`action-dropdown-${props.transaction.id}`}
					aria-label="Action"
					style={`anchor-name: --action-button-${props.transaction.id};`}>
					<EllipsisVertical class="inline-6" />
				</Button>

				{/* dropdown popover */}
				<div
					ref={popoverRef}
					id={`action-dropdown-${props.transaction.id}`}
					popover
					class="z-50 bg-bg-card shadow-elevation-medium p-1 border border-border rounded-xl w-48 position-dropdown-popover"
					style={`position-anchor: --action-button-${props.transaction.id};`}>
					<button
						type="button"
						id="edit-button"
						onClick={() => {
							props.onEdit(props.transaction);
							popoverRef?.hidePopover();
						}}
						class="flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full text-text-muted hover:text-secondary text-sm text-left transition-colors duration-150 cursor-pointer">
						<SquarePen class="w-4 h-4" />
						<span>Edit Transaksi</span>
					</button>

					<button
						type="button"
						onClick={() => {
							props.onToggleType(props.transaction.id);
							popoverRef?.hidePopover();
						}}
						class="flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full text-text-muted hover:text-secondary text-sm text-left transition-colors duration-150 cursor-pointer">
						<ArrowRightLeft class="w-4 h-4" />
						<span>Ubah Tipe Transaksi</span>
					</button>

					<button
						type="button"
						onClick={() => {
							props.onDelete(props.transaction.id);
							popoverRef?.hidePopover();
						}}
						class="flex items-center gap-2 hover:bg-bg-surface px-3 py-2 rounded-lg w-full text-delete-button text-sm text-left transition-colors duration-150 cursor-pointer">
						<Trash2 class="w-4 h-4" />
						<span>Hapus Transaksi</span>
					</button>
				</div>
			</div>
		</section>
	);
}
