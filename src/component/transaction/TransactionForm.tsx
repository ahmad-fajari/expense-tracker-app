import { createSignal, createEffect } from "solid-js";
import type { Transaction } from "~/types";

interface TransactionFormProps {
	onSubmit: (data: {
		title: string;
		amount: number;
		date: string;
		type: "income" | "expense";
	}) => void;
	editingTransaction: Transaction | null;
}

export default function TransactionForm(props: TransactionFormProps) {
	const [title, setTitle] = createSignal("");
	const [amount, setAmount] = createSignal<number | "">("");
	const [date, setDate] = createSignal("");
	const [type, setType] = createSignal<"income" | "expense" | "">("");

	const todayString = new Date().toISOString().split("T")[0];

	// Reset form to default / empty state
	const resetForm = () => {
		setTitle("");
		setAmount("");
		setDate(todayString);
		setType("");
	};

	// Initialize / listen to edit mode changes
	createEffect(() => {
		const tx = props.editingTransaction;
		if (tx) {
			setTitle(tx.title);
			setAmount(tx.amount);
			setDate(tx.date);
			setType(tx.type);
		} else {
			resetForm();
		}
	});

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		// Custom validation logic matching the original browser Constraint Validation rules:
		if (!title()) {
			alert("Keterangan wajib diisi");
			return;
		}
		if (amount() === "" || amount() === null) {
			alert("Nominal wajib diisi");
			return;
		}
		if (Number(amount()) < 1) {
			alert("Nominal tidak boleh kurang dari Rp. 1");
			return;
		}
		if (!date()) {
			alert("Tanggal wajib diisi");
			return;
		}
		if (date() > todayString) {
			alert("Tanggal tidak boleh lebih dari hari ini");
			return;
		}
		if (!type()) {
			alert("Klasifikasi transaksi wajib dipilih");
			return;
		}

		// Submit data
		props.onSubmit({
			title: title(),
			amount: Number(amount()),
			date: date(),
			type: type() as "income" | "expense",
		});

		// Reset form if we were not in edit mode (App will clear edit state on submit)
		if (!props.editingTransaction) {
			resetForm();
		}
	};

	return (
		<section
			class="tracker-main__form-section tracker-form-section"
			aria-labelledby="form-heading">
			<h2 id="form-heading" class="tracker-form-section__heading">
				{props.editingTransaction
					? "Ubah Pencatatan"
					: "Tambah Pencatatan Baru"}
			</h2>

			<form
				id="transactionForm"
				data-testid="transactionForm"
				class="tracker-transaction-form"
				onSubmit={handleSubmit}
				novalidate>
				{/* keterangan */}
				<div class="tracker-transaction-form__field">
					<label
						class="tracker-transaction-form__label"
						for="transactionFormTitleInput">
						Keterangan
					</label>
					<input
						type="text"
						id="transactionFormTitleInput"
						data-testid="transactionFormTitleInput"
						class="tracker-transaction-form__input tracker-input"
						placeholder="Misal: Makan siang..."
						value={title()}
						onInput={(e) => setTitle(e.currentTarget.value)}
						required
					/>
				</div>

				{/* nominal */}
				<div class="tracker-transaction-form__field">
					<label
						class="tracker-transaction-form__label"
						for="transactionFormAmountInput">
						Nominal (Rp)
					</label>
					<input
						type="number"
						id="transactionFormAmountInput"
						data-testid="transactionFormAmountInput"
						class="tracker-transaction-form__input tracker-input"
						placeholder="50000"
						min="1"
						value={amount()}
						onInput={(e) => {
							const val = e.currentTarget.value;
							setAmount(val === "" ? "" : Number(val));
						}}
						required
					/>
				</div>

				{/* tanggal */}
				<div class="tracker-transaction-form__field">
					<label
						class="tracker-transaction-form__label"
						for="transactionFormDateInput">
						Tanggal
					</label>
					<input
						type="date"
						id="transactionFormDateInput"
						data-testid="transactionFormDateInput"
						class="tracker-transaction-form__input tracker-input"
						max={todayString}
						value={date()}
						onInput={(e) => setDate(e.currentTarget.value)}
						required
					/>
				</div>

				{/* Klasifikasi */}
				<div class="tracker-transaction-form__field">
					<label
						class="tracker-transaction-form__label"
						for="transactionFormTypeSelect">
						Klasifikasi
					</label>
					<select
						id="transactionFormTypeSelect"
						data-testid="transactionFormTypeSelect"
						class="tracker-transaction-form__input tracker-input"
						value={type()}
						onChange={(e) =>
							setType(e.currentTarget.value as "income" | "expense")
						}
						required>
						<option value="" disabled selected hidden>
							Pilih klasifikasi transaksi
						</option>
						<option value="income">Uang Masuk</option>
						<option value="expense">Uang Keluar</option>
					</select>
				</div>

				{/* simpan button */}
				<button
					type="submit"
					data-testid="transactionFormSubmitButton"
					class="tracker-transaction-form__submit">
					{props.editingTransaction ? "Simpan Perubahan" : "Catat Transaksi"}
				</button>
			</form>
		</section>
	);
}
