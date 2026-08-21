import { z } from "astro/zod";

export const transactionSchema = z.object({
	title: z.string().min(1, "Keterangan wajib diisi"),
	amount: z.number().min(1, "Nominal tidak boleh kurang dari Rp. 1"),
	date: z.string().min(1, "Tanggal wajib diisi"),
	type: z.enum(["income", "expense"]),
});

export const updateTransactionSchema = transactionSchema.extend({
	id: z.string(),
});

export const deleteTransactionSchema = z.object({
	id: z.string(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;
