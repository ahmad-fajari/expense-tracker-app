import { For, Show, createMemo } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { actions } from "astro:actions";
import { Wallet } from "lucide-solid";
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
		<div id="transaction-list" class="gap-6 grid lg:grid-cols-[1fr_1fr]">
			{/* Arus Pemasukan */}
			<div class="@container max-block-max tracker-card">
				<div class="flex justify-between">
					<h3 class="font-semibold text-[0.85rem] text-text-muted uppercase tracking-wider mbe-2 cap-alphabetic">
						Arus Pemasukan
					</h3>
				</div>
				{/* Jangan ubah atau hapus atribut data-testid pada elemen berikut */}
				<div id="incomeList" data-testid="incomeList" class="flex flex-col">
					<Show
						when={incomeTransactions().length > 0}
						fallback={
							<div class="flex flex-col items-center justify-center py-8 text-text-muted gap-2">
								<Wallet class="w-8 h-8 opacity-40" />
								<span>Tidak ada transaksi</span>
							</div>
						}>
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
					</Show>
				</div>
			</div>

			{/* Arus Pengeluaran */}
			<div class="@container max-block-max tracker-card">
				<div class="tracker-transaction-list__header">
					<h3 class="font-semibold text-[0.85rem] text-text-muted uppercase tracking-wider mbe-2 cap-alphabetic">
						Arus Pengeluaran
					</h3>
				</div>
				{/* Jangan ubah atau hapus atribut data-testid pada elemen berikut */}
				<div id="expenseList" data-testid="expenseList" class="flex flex-col">
					<Show
						when={expenseTransactions().length > 0}
						fallback={
							<div class="flex flex-col items-center justify-center py-8 text-text-muted gap-2">
								<Wallet class="w-8 h-8 opacity-40" />
								<span>Tidak ada transaksi</span>
							</div>
						}>
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
					</Show>
				</div>
			</div>
		</div>
	);
}
