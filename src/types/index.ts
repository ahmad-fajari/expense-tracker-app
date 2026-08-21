export interface Transaction {
	id: string;
	userId: string;
	title: string;
	amount: number;
	date: string;
	type: "income" | "expense";
	createdAt: Date;
}
