import { createForm } from "@tanstack/solid-form";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { actions } from "astro:actions";
import { Show, createEffect } from "solid-js";
import type { Transaction } from "~/types";

interface TransactionFormProps {
	editingTransaction: Transaction | null;
	onSuccess: () => void;
}

export default function TransactionForm(props: TransactionFormProps) {
	const queryClient = useQueryClient();
	const todayString = new Date().toISOString().split("T")[0];

	// Mutation: Tambah Transaksi
	const createTxMutation = createMutation(() => ({
		mutationFn: async (data: {
			title: string;
			amount: number;
			date: string;
			type: "income" | "expense";
		}) => {
			const result = await actions.createTransaction(data);
			if (result.error) throw new Error(result.error.message);
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			props.onSuccess();
		},
	}));

	// Mutation: Edit Transaksi
	const updateTxMutation = createMutation(() => ({
		mutationFn: async (data: {
			id: string;
			title: string;
			amount: number;
			date: string;
			type: "income" | "expense";
		}) => {
			const result = await actions.updateTransaction(data);
			if (result.error) throw new Error(result.error.message);
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			props.onSuccess();
		},
	}));

	// Inisialisasi TanStack Form
	const form = createForm(() => ({
		defaultValues: {
			title: "",
			amount: "" as number | "",
			date: todayString,
			type: "" as "income" | "expense" | "",
		},
		onSubmit: async ({ value }) => {
			const editTx = props.editingTransaction;
			try {
				if (editTx) {
					await updateTxMutation.mutateAsync({
						id: editTx.id,
						title: value.title,
						amount: Number(value.amount),
						date: value.date,
						type: value.type as "income" | "expense",
					});
				} else {
					await createTxMutation.mutateAsync({
						title: value.title,
						amount: Number(value.amount),
						date: value.date,
						type: value.type as "income" | "expense",
					});
				}
				if (!editTx) {
					form.reset();
				}
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Terjadi kesalahan";
				alert(`Gagal menyimpan transaksi: ${message}`);
			}
		},
	}));

	// Sinkronisasi data saat mode edit diaktifkan
	createEffect(() => {
		const tx = props.editingTransaction;
		if (tx) {
			form.reset({
				title: tx.title,
				amount: tx.amount,
				date: tx.date,
				type: tx.type,
			});
		} else {
			form.reset({
				title: "",
				amount: "",
				date: todayString,
				type: "",
			});
		}
	});

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
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
				<form.Field
					name="title"
					validators={{
						onChange: ({ value }) =>
							!value ? "Keterangan wajib diisi" : undefined,
					}}>
					{(field) => (
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
								value={field().state.value}
								onInput={(e) => field().handleChange(e.currentTarget.value)}
								onBlur={field().handleBlur}
								required
							/>
							<Show
								when={
									field().state.meta.isTouched &&
									field().state.meta.errors.length
								}>
								<span class="text-red-500 text-sm mt-1 block">
									{field().state.meta.errors.join(", ")}
								</span>
							</Show>
						</div>
					)}
				</form.Field>

				{/* nominal */}
				<form.Field
					name="amount"
					validators={{
						onChange: ({ value }) => {
							if (value === "" || value === null || value === undefined) {
								return "Nominal wajib diisi";
							}
							if (Number(value) < 1) {
								return "Nominal tidak boleh kurang dari Rp. 1";
							}
							return undefined;
						},
					}}>
					{(field) => (
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
								value={field().state.value}
								onInput={(e) => {
									const val = e.currentTarget.value;
									field().handleChange(val === "" ? "" : Number(val));
								}}
								onBlur={field().handleBlur}
								required
							/>
							<Show
								when={
									field().state.meta.isTouched &&
									field().state.meta.errors.length
								}>
								<span class="text-red-500 text-sm mt-1 block">
									{field().state.meta.errors.join(", ")}
								</span>
							</Show>
						</div>
					)}
				</form.Field>

				{/* tanggal */}
				<form.Field
					name="date"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "Tanggal wajib diisi";
							if (value > todayString) {
								return "Tanggal tidak boleh lebih dari hari ini";
							}
							return undefined;
						},
					}}>
					{(field) => (
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
								value={field().state.value}
								onInput={(e) => field().handleChange(e.currentTarget.value)}
								onBlur={field().handleBlur}
								required
							/>
							<Show
								when={
									field().state.meta.isTouched &&
									field().state.meta.errors.length
								}>
								<span class="text-red-500 text-sm mt-1 block">
									{field().state.meta.errors.join(", ")}
								</span>
							</Show>
						</div>
					)}
				</form.Field>

				{/* Klasifikasi */}
				<form.Field
					name="type"
					validators={{
						onChange: ({ value }) =>
							!value ? "Klasifikasi transaksi wajib dipilih" : undefined,
					}}>
					{(field) => (
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
								value={field().state.value}
								onChange={(e) =>
									field().handleChange(
										e.currentTarget.value as "income" | "expense",
									)
								}
								onBlur={field().handleBlur}
								required>
								<option value="" disabled hidden>
									Pilih klasifikasi transaksi
								</option>
								<option value="income">Uang Masuk</option>
								<option value="expense">Uang Keluar</option>
							</select>
							<Show
								when={
									field().state.meta.isTouched &&
									field().state.meta.errors.length
								}>
								<span class="text-red-500 text-sm mt-1 block">
									{field().state.meta.errors.join(", ")}
								</span>
							</Show>
						</div>
					)}
				</form.Field>

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
