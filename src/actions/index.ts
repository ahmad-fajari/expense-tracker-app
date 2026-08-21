import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { transaction, user } from "../db/schema";
import { auth } from "../lib/auth";

export const server = {
	// Mengambil daftar transaksi user
	getTransactions: defineAction({
		handler: async (_input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db.insert(user).values({ id: userId }).onConflictDoNothing();
			}

			const data = await db
				.select()
				.from(transaction)
				.where(eq(transaction.userId, userId))
				.orderBy(desc(transaction.createdAt));

			return data;
		},
	}),

	// Menambah transaksi baru
	createTransaction: defineAction({
		input: z.object({
			title: z.string().min(1, "Keterangan wajib diisi"),
			amount: z.number().min(1, "Nominal tidak boleh kurang dari Rp. 1"),
			date: z.string().min(1, "Tanggal wajib diisi"),
			type: z.enum(["income", "expense"]),
		}),
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db.insert(user).values({ id: userId }).onConflictDoNothing();
			}

			const id = `tx-${Date.now()}`;
			await db.insert(transaction).values({
				id,
				userId,
				title: input.title,
				amount: input.amount,
				date: input.date,
				type: input.type,
			});

			return { success: true, id };
		},
	}),

	// Memperbarui transaksi
	updateTransaction: defineAction({
		input: z.object({
			id: z.string(),
			title: z.string().min(1, "Keterangan wajib diisi"),
			amount: z.number().min(1, "Nominal tidak boleh kurang dari Rp. 1"),
			date: z.string().min(1, "Tanggal wajib diisi"),
			type: z.enum(["income", "expense"]),
		}),
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db.insert(user).values({ id: userId }).onConflictDoNothing();
			}

			const [existing] = await db
				.select()
				.from(transaction)
				.where(eq(transaction.id, input.id));

			if (!existing || existing.userId !== userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Anda tidak memiliki akses ke transaksi ini.",
				});
			}

			await db
				.update(transaction)
				.set({
					title: input.title,
					amount: input.amount,
					date: input.date,
					type: input.type,
				})
				.where(eq(transaction.id, input.id));

			return { success: true };
		},
	}),

	// Mengubah klasifikasi tipe transaksi (Pemasukan <-> Pengeluaran)
	toggleTransactionType: defineAction({
		input: z.object({
			id: z.string(),
		}),
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db.insert(user).values({ id: userId }).onConflictDoNothing();
			}

			const [existing] = await db
				.select()
				.from(transaction)
				.where(eq(transaction.id, input.id));

			if (!existing || existing.userId !== userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Anda tidak memiliki akses ke transaksi ini.",
				});
			}

			const newType = existing.type === "income" ? "expense" : "income";

			await db
				.update(transaction)
				.set({ type: newType })
				.where(eq(transaction.id, input.id));

			return { success: true, newType };
		},
	}),

	// Menghapus transaksi
	deleteTransaction: defineAction({
		input: z.object({
			id: z.string(),
		}),
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db.insert(user).values({ id: userId }).onConflictDoNothing();
			}

			const [existing] = await db
				.select()
				.from(transaction)
				.where(eq(transaction.id, input.id));

			if (!existing || existing.userId !== userId) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Anda tidak memiliki akses ke transaksi ini.",
				});
			}

			await db.delete(transaction).where(eq(transaction.id, input.id));

			return { success: true };
		},
	}),
};
