import { For, createMemo } from "solid-js";
import type { Transaction } from "~/types";
import TransactionItem from "./TransactionItem";

interface TransactionListProps {
	transactions: Transaction[];
	onEdit: (transaction: Transaction) => void;
	onDelete: (id: string) => void;
	onToggleType: (id: string) => void;
}

export default function TransactionList(props: TransactionListProps) {
	const incomeTransactions = createMemo(() => {
		return props.transactions.filter((t) => t.type === "income");
	});

	const expenseTransactions = createMemo(() => {
		return props.transactions.filter((t) => t.type === "expense");
	});

	return (
		<div id="transaction-list" class="tracker-transaction-list">
			{/* Arus Pemasukan */}
			<div class="tracker-transaction-list__card tracker-card">
				<div class="tracker-transaction-list__header">
					<h3 class="tracker-transaction-list__title">Arus Pemasukan</h3>
				</div>
				{/* Jangan ubah atau hapus atribut data-testid pada elemen berikut */}
				<div
					id="incomeList"
					data-testid="incomeList"
					class="tracker-transaction-list__container">
					<For each={incomeTransactions()}>
						{(transaction) => (
							<TransactionItem
								transaction={transaction}
								onEdit={props.onEdit}
								onDelete={props.onDelete}
								onToggleType={props.onToggleType}
							/>
						)}
					</For>
				</div>
			</div>

			{/* Arus Pengeluaran */}
			<div class="tracker-transaction-list__card tracker-card">
				<div class="tracker-transaction-list__header">
					<h3 class="tracker-transaction-list__title">Arus Pengeluaran</h3>
				</div>
				{/* Jangan ubah atau hapus atribut data-testid pada elemen berikut */}
				<div
					id="expenseList"
					data-testid="expenseList"
					class="tracker-transaction-list__container">
					<For each={expenseTransactions()}>
						{(transaction) => (
							<TransactionItem
								transaction={transaction}
								onEdit={props.onEdit}
								onDelete={props.onDelete}
								onToggleType={props.onToggleType}
							/>
						)}
					</For>
				</div>
			</div>
		</div>
	);
}
