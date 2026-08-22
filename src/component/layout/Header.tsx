import { createMemo } from "solid-js";
import { CircleUserIcon } from "lucide-solid";

import ThemeToggle from "~/component/ui/ThemeToggle";

import { authClient } from "~/lib/auth-client";

export default function Header() {
	const session = authClient.useSession();

	const userDisplay = createMemo(() => {
		const currentUser = session().data?.user;
		if (currentUser) {
			return {
				name: currentUser.name,
				email: currentUser.email,
			};
		}
		// Fallback statis jika belum login
		return {
			name: "Ahmad Fajari",
			email: "ahmad_fajari",
		};
	});

	const headerDateString = createMemo(() => {
		return new Date().toLocaleDateString("id-ID", {
			month: "long",
			year: "numeric",
		});
	});

	return (
		<header class="inline-full top-0 z-10 sticky justify-normal bg-bg-card shadow-elevation-medium">
			<div class="md:max-inline-[50rem] lg:max-inline-[80rem] flex justify-end items-center gap-4 mx-auto p-4">
				<h1 class="justify-self-start me-auto font-extrabold text-2xl tracking-[-0.03em]">
					Tactic<span class="text-primary-text">Cash</span>
				</h1>

				<ThemeToggle />

				<div class="flex items-center gap-[0.85rem]">
					<div class="justify-items-end gap-1 grid grid-cols-[auto] sm:grid-cols-[repeat(2,auto)]">
						<span class="text-[0.95rem] text-text">
							Halo, <strong>{userDisplay().name}</strong>
						</span>
						<span>({userDisplay().email})</span>
						<span
							id="header-date"
							class="sm:col-span-2 font-medium text-[0.8rem] text-text-muted">
							{headerDateString()}
						</span>
					</div>
					<CircleUserIcon
						strokeWidth={1.5}
						absoluteStrokeWidth={true}
						class="block-auto inline-10 text-primary-text"
					/>
				</div>
			</div>
		</header>
	);
}
