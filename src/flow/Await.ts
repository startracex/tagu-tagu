import { useState } from "../signal/Signal";
import { Switch } from "./Switch";

export function Await<T>(
	promise: Promise<T>,
	options?: { pending?: () => Element },
) {
	const promiseState = useState("pending");

	const switchOptions = {
		pending: options?.pending,
	} as Record<string, () => Element>;

	return Switch(promiseState, switchOptions);
}
