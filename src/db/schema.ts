import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "~/db/auth-schema";

export * from "~/db/auth-schema";

// Skema Transaksi dengan Relasi User
export const transaction = pgTable("transaction", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }), // Relasi transaksi ke user tertentu
	title: text("title").notNull(),
	amount: integer("amount").notNull(),
	date: text("date").notNull(), // Menyimpan tanggal berformat YYYY-MM-DD
	type: text("type").$type<"income" | "expense">().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
