import { defineAction, ActionError } from "astro:actions";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { transaction, user } from "../db/schema";
import { auth } from "../lib/auth";
import {
	transactionSchema,
	updateTransactionSchema,
	deleteTransactionSchema,
} from "../lib/schema/transaction-schema";

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
				await db
					.insert(user)
					.values({
						id: userId,
						email: "dev-user@example.com",
						name: "Development User",
						emailVerified: false,
					})
					.onConflictDoNothing();
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
		input: transactionSchema,
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db
					.insert(user)
					.values({
						id: userId,
						email: "dev-user@example.com",
						name: "Development User",
						emailVerified: false,
					})
					.onConflictDoNothing();
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
		input: updateTransactionSchema,
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db
					.insert(user)
					.values({
						id: userId,
						email: "dev-user@example.com",
						name: "Development User",
						emailVerified: false,
					})
					.onConflictDoNothing();
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
		input: deleteTransactionSchema,
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db
					.insert(user)
					.values({
						id: userId,
						email: "dev-user@example.com",
						name: "Development User",
						emailVerified: false,
					})
					.onConflictDoNothing();
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
		input: deleteTransactionSchema,
		handler: async (input, context) => {
			const session = await auth.api.getSession({
				headers: context.request.headers,
			});
			let userId = session?.user?.id;

			if (!userId) {
				userId = "dev-user";
				await db
					.insert(user)
					.values({
						id: userId,
						email: "dev-user@example.com",
						name: "Development User",
						emailVerified: false,
					})
					.onConflictDoNothing();
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
