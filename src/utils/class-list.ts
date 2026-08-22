type ClassValue =
	| string
	| number
	| boolean
	| undefined
	| null
	| Record<string, unknown>
	| ClassValue[];

export function classList(...args: ClassValue[]): string {
	const classes: string[] = [];

	for (const arg of args) {
		if (!arg) continue;

		if (typeof arg === "string" || typeof arg === "number") {
			classes.push(String(arg));
		} else if (Array.isArray(arg)) {
			const inner = classList(...arg);
			if (inner) classes.push(inner);
		} else if (typeof arg === "object") {
			for (const key in arg) {
				if (Object.hasOwn(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(" ");
}
