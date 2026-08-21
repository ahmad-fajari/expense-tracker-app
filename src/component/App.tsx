import { createSignal, createMemo } from "solid-js";
import {
	QueryClient,
	QueryClientProvider,
	createQuery,
} from "@tanstack/solid-query";
import { actions } from "astro:actions";
import type { Transaction, SerializedTransaction } from "~/types";
import Header from "./layout/Header";
import Summary from "./dashboard/Summary";
import TransactionForm from "./transaction/TransactionForm";
import SearchBar from "./transaction/SearchBar";
import TransactionList from "./transaction/TransactionList";

const queryClient = new QueryClient();

interface AppProps {
	initialTransactions?: SerializedTransaction[];
}

export default function App(props: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<TrackerApp initialTransactions={props.initialTransactions} />
		</QueryClientProvider>
	);
}

interface TrackerAppProps {
	initialTransactions?: SerializedTransaction[];
}

function TrackerApp(props: TrackerAppProps) {
	const [searchQuery, setSearchQuery] = createSignal("");
	const [editingTransaction, setEditingTransaction] =
		createSignal<Transaction | null>(null);

	// TanStack Query untuk fetching transaksi secara reaktif dengan initialData opsional
	const transactionsQuery = createQuery(() => ({
		queryKey: ["transactions"],
		queryFn: async () => {
			const result = await actions.getTransactions();
			if (result.error) {
				throw new Error(result.error.message);
			}
			return (
				result.data?.map((item) => ({
					...item,
					createdAt: new Date(item.createdAt),
				})) || []
			);
		},
		initialData: (props.initialTransactions || []).map((item) => ({
			...item,
			createdAt: new Date(item.createdAt),
		})),
	}));

	// Memulai mode edit transaksi
	const handleEdit = (transaction: Transaction) => {
		setEditingTransaction(transaction);
		const titleInput = document.getElementById("transactionFormTitleInput");
		if (titleInput) {
			(titleInput as HTMLInputElement).focus();
		}
	};

	// Filter transaksi secara reaktif berdasarkan search query
	const filteredTransactions = createMemo(() => {
		const query = searchQuery().toLowerCase().trim();
		const list = transactionsQuery.data || [];
		if (!query) {
			return list;
		}
		return list.filter((t) => t.title.toLowerCase().includes(query));
	});

	return (
		<div class="tracker-app">
			{/* Header */}
			<Header />

			{/* Main Content */}
			<main class="tracker-main">
				{/* Financial Summary */}
				<Summary transactions={transactionsQuery.data || []} />

				{/* Add/Edit Transaction Form */}
				<TransactionForm
					editingTransaction={editingTransaction()}
					onSuccess={() => setEditingTransaction(null)}
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
					/>
				</section>
			</main>
		</div>
	);
}
