import { createSignal, onMount, createMemo } from "solid-js";
import { actions } from "astro:actions";
import type { Transaction } from "~/types";
import Header from "./layout/Header";
import Summary from "./dashboard/Summary";
import TransactionForm from "./transaction/TransactionForm";
import SearchBar from "./transaction/SearchBar";
import TransactionList from "./transaction/TransactionList";

interface ParsedTransaction extends Omit<Transaction, "createdAt"> {
	createdAt: Date;
}

interface StoredTransaction extends Omit<Transaction, "createdAt"> {
	createdAt: string | Date;
}

interface TransactionFormData {
	title: string;
	amount: number;
	date: string;
	type: "income" | "expense";
}

export default function App() {
	const [transactions, setTransactions] = createSignal<Transaction[]>([]);
	const [searchQuery, setSearchQuery] = createSignal("");
	const [editingTransaction, setEditingTransaction] =
		createSignal<Transaction | null>(null);

	// Load transactions on mount
	const fetchTransactions = async (): Promise<void> => {
		try {
			const result = await actions.getTransactions();
			if (result.data) {
				// Pastikan parsing tanggal dari database terdefinisi dengan benar
				const list: ParsedTransaction[] = result.data.map(
					(item: StoredTransaction): ParsedTransaction => ({
						...item,
						createdAt: new Date(item.createdAt),
					}),
				);
				setTransactions(list);
			}
		} catch (err) {
			console.error("Gagal mengambil data transaksi:", err);
		}
	};

	onMount(() => {
		fetchTransactions();
	});

	// Handle adding or updating transaction
	const handleFormSubmit = async (
		formData: TransactionFormData,
	): Promise<void> => {
		const editTx = editingTransaction();
		if (editTx) {
			// Mode Edit
			const { error } = await actions.updateTransaction({
				id: editTx.id,
				...formData,
			});
			if (error) {
				alert(`Gagal menyimpan perubahan: ${error.message}`);
				return;
			}
			setEditingTransaction(null);
		} else {
			// Mode Simpan Baru
			const { error } = await actions.createTransaction(formData);
			if (error) {
				alert(`Gagal menyimpan transaksi: ${error.message}`);
				return;
			}
		}
		// Refresh data
		fetchTransactions();
	};

	// Handle toggle transaction classification type (income <-> expense)
	const handleToggleType = async (id: string): Promise<void> => {
		const { error } = await actions.toggleTransactionType({ id });
		if (error) {
			alert(`Gagal mengubah tipe: ${error.message}`);
			return;
		}
		// Jika transaksi yang sedang diedit tipenya di-toggle di riwayat, sesuaikan state form
		const editTx = editingTransaction();
		if (editTx && editTx.id === id) {
			setEditingTransaction({
				...editTx,
				type: editTx.type === "income" ? "expense" : "income",
			});
		}
		fetchTransactions();
	};

	// Handle deleting transaction
	const handleDelete = async (id: string): Promise<void> => {
		if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
			const { error } = await actions.deleteTransaction({ id });
			if (error) {
				alert(`Gagal menghapus transaksi: ${error.message}`);
				return;
			}
			// Jika transaksi yang sedang diedit dihapus, batalkan edit mode
			const editTx = editingTransaction();
			if (editTx && editTx.id === id) {
				setEditingTransaction(null);
			}
			fetchTransactions();
		}
	};

	// Start edit transaction mode
	const handleEdit = (transaction: Transaction): void => {
		setEditingTransaction(transaction);
		// Arahkan fokus ke input form keterangan demi kemudahan input user
		const titleInput = document.getElementById("transactionFormTitleInput");
		if (titleInput) {
			(titleInput as HTMLInputElement).focus();
		}
	};

	// Filter transactions berdasarkan search query
	const filteredTransactions = createMemo(() => {
		const query = searchQuery().toLowerCase().trim();
		if (!query) {
			return transactions();
		}
		return transactions().filter((t) => t.title.toLowerCase().includes(query));
	});

	return (
		<div class="tracker-app">
			{/* Header */}
			<Header />

			{/* Main Content */}
			<main class="tracker-main">
				{/* Financial Summary */}
				<Summary transactions={transactions()} />

				{/* Add/Edit Transaction Form */}
				<TransactionForm
					onSubmit={handleFormSubmit}
					editingTransaction={editingTransaction()}
				/>

				{/* Transaction History Section */}
				<section class="tracker-history" aria-labelledby="history-heading">
					<h2 id="history-heading" class="visually-hidden">
						Riwayat Transaksi
					</h2>

					{/* Search Bar */}
					<SearchBar
						value={searchQuery()}
						onInput={setSearchQuery}
						onClear={() => setSearchQuery("")}
					/>

					{/* Transaction Lists grouped by type */}
					<TransactionList
						transactions={filteredTransactions()}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onToggleType={handleToggleType}
					/>
				</section>
			</main>
		</div>
	);
}
