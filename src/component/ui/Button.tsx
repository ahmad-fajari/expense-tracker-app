import { splitProps, type JSX, mergeProps } from "solid-js";
import { classList } from "~/utils/class-list";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "action" | "delete" | "outline";
}

export default function Button(props: ButtonProps) {
	// Merge default props: default type is "button", default variant is "primary"
	const merged = mergeProps(
		{ type: "button" as const, variant: "primary" as const },
		props,
	);

	// Split coreProps and restProps as requested
	const [coreProps, restProps] = splitProps(merged, [
		"type",
		"variant",
		"class",
		"children",
	]);

	return (
		<button
			type={coreProps.type}
			class={classList(
				coreProps.class,
				"button",
				{ "button--primary": coreProps.variant === "primary" },
				{ "button--secondary": coreProps.variant === "secondary" },
				{ "button--action": coreProps.variant === "action" },
				{ "button--delete": coreProps.variant === "delete" },
				{ "button--outline": coreProps.variant === "outline" },
			)}
			{...restProps}>
			{coreProps.children}
		</button>
	);
}
