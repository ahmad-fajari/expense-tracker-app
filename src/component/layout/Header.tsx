import { createMemo } from "solid-js";
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
		<header class="tracker-header">
			<div class="tracker-header__wrapper">
				<h1 class="tracker-header__title">
					Tactic<span>Cash</span>
				</h1>
				<div class="tracker-header__user">
					<div class="tracker-header__user-info">
						<span class="tracker-header__greeting">
							Halo, <strong>{userDisplay().name}</strong>
						</span>
						<span>({userDisplay().email})</span>
						{/* Jangan ubah id "header-date" untuk kompatibilitas pengujian */}
						<span id="header-date" class="tracker-header__date">
							{headerDateString()}
						</span>
					</div>
					<div class="tracker-header__avatar">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 640"
							aria-hidden="true">
							<path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
						</svg>
					</div>
				</div>
			</div>
		</header>
	);
}
