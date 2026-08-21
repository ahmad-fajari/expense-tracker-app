import { createMemo } from "solid-js";
import type { Transaction } from "~/types";

interface SummaryProps {
	transactions: Transaction[];
}

export default function Summary(props: SummaryProps) {
	const totalIncome = createMemo(() => {
		return props.transactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);
	});

	const totalExpense = createMemo(() => {
		return props.transactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);
	});

	const totalBalance = createMemo(() => {
		return totalIncome() - totalExpense();
	});

	const formatCurrency = (amount: number) => {
		// Menghitung tanda minus secara manual agar format "Rp. -X.XXX" atau "-Rp. X.XXX" konsisten
		const isNegative = amount < 0;
		const absoluteAmount = Math.abs(amount);
		return `${isNegative ? "-" : ""}Rp. ${absoluteAmount.toLocaleString("id-ID")}`;
	};

	return (
		<section
			class="tracker-main__summary tracker-summary"
			aria-labelledby="summary-heading">
			<h2 id="summary-heading" class="visually-hidden">
				Ringkasan Keuangan
			</h2>

			{/* Saldo Saat Ini */}
			<div class="tracker-summary__balance tracker-card">
				<h3 class="tracker-summary__label tracker-summary__label--balance">
					<svg
						class="tracker-transaction-icon tracker-transaction-icon--larger primary"
						aria-hidden="true"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960">
						<path d="M71.87-111.87v-91H434.5V-645.8q-25.04-9.48-43.33-27.88-18.28-18.41-27.76-43.45H245.74l117.13 273.54q0 52.69-42.58 89.58-42.59 36.88-102.83 36.88-60.24 0-102.92-36.88-42.67-36.89-42.67-89.58l117.37-273.54h-77.37v-91h251.54q13.2-35.48 44.94-57.74 31.74-22.26 71.67-22.26 39.94 0 71.65 22.26 31.72 22.26 44.92 57.74h251.54v91h-77.37l117.37 273.54q0 52.69-42.58 89.58-42.59 36.88-102.83 36.88-60.24 0-102.92-36.88-42.67-36.89-42.67-89.58l117.13-273.54H596.59q-9.48 25.04-27.76 43.45-18.29 18.4-43.33 27.88v442.93h362.63v91H71.87Zm599.35-334.35h142.82l-71.41-165.63-71.41 165.63Zm-525.02 0h142.82l-71.65-165.63-71.17 165.63ZM480.07-724.3q16.21 0 27.11-11.15 10.91-11.14 10.91-27.28 0-16.15-10.92-27.07-10.93-10.92-27.07-10.92t-27.17 10.92q-11.02 10.92-11.02 27.07 0 16.14 10.97 27.28 10.97 11.15 27.19 11.15Z" />
					</svg>
					Saldo Saat Ini
				</h3>
				{/* Jangan ubah id "balance-amount" untuk kompatibilitas pengujian */}
				<p id="balance-amount" class="tracker-summary__balance-amount primary">
					{formatCurrency(totalBalance())}
				</p>
			</div>

			{/* Pemasukan */}
			<div class="tracker-summary__stat tracker-summary__stat--income tracker-card">
				<h3 class="tracker-summary__label">
					<svg
						class="tracker-transaction-icon income"
						aria-hidden="true"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960">
						<path d="M192.59-192.11v-411h91v256.35l460.89-460.89L808.13-744 347.24-283.11h256.35v91h-411Z" />
					</svg>
					Pemasukan
				</h3>
				{/* Jangan ubah id "income-amount" untuk kompatibilitas pengujian */}
				<p id="income-amount" class="tracker-summary__stat-amount income">
					{formatCurrency(totalIncome())}
				</p>
			</div>

			{/* Pengeluaran */}
			<div class="tracker-summary__stat tracker-summary__stat--expense tracker-card">
				<h3 class="tracker-summary__label">
					<svg
						class="tracker-transaction-icon tracker-transaction-icon--expense expense"
						aria-hidden="true"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -960 960 960">
						<path d="M192.59-192.11v-411h91v256.35l460.89-460.89L808.13-744 347.24-283.11h256.35v91h-411Z" />
					</svg>
					Pengeluaran
				</h3>
				{/* Jangan ubah id "expense-amount" untuk kompatibilitas pengujian */}
				<p id="expense-amount" class="tracker-summary__stat-amount expense">
					{formatCurrency(totalExpense())}
				</p>
			</div>
		</section>
	);
}
