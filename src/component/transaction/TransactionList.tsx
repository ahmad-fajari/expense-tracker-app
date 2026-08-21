import { For, createMemo } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { actions } from "astro:actions";
import type { Transaction } from "~/types";
import TransactionItem from "./TransactionItem";

interface TransactionListProps {
	transactions: Transaction[];
	onEdit: (transaction: Transaction) => void;
}

export default function TransactionList(props: TransactionListProps) {
	const queryClient = useQueryClient();

	// Mutation: Hapus Transaksi
	const deleteTxMutation = createMutation(() => ({
		mutationFn: async (id: string) => {
			const result = await actions.deleteTransaction({ id });
			if (result.error) throw new Error(result.error.message);
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	}));

	// Mutation: Ubah Klasifikasi Tipe (income <-> expense)
	const toggleTxTypeMutation = createMutation(() => ({
		mutationFn: async (id: string) => {
			const result = await actions.toggleTransactionType({ id });
			if (result.error) throw new Error(result.error.message);
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	}));

	const handleToggleType = async (id: string) => {
		try {
			await toggleTxTypeMutation.mutateAsync(id);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Terjadi kesalahan";
			alert(`Gagal mengubah tipe: ${message}`);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
			try {
				await deleteTxMutation.mutateAsync(id);
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Terjadi kesalahan";
				alert(`Gagal menghapus transaksi: ${message}`);
			}
		}
	};

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
								onDelete={handleDelete}
								onToggleType={handleToggleType}
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
								onDelete={handleDelete}
								onToggleType={handleToggleType}
							/>
						)}
					</For>
				</div>
			</div>
		</div>
	);
}
