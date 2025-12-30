import {
	InternalComputed,
	type InternalSignal,
	InternalState,
} from "./InternalSignal";

export class Signal<T = any> {
	protected internal: InternalSignal<T>;
	constructor(internal: InternalSignal<T>) {
		this.internal = internal;
	}

	get() {
		if (current) {
			this.internal.subscribers.add(current);
		}
		return this.internal.get();
	}
}

export class State<T> extends Signal<T> {
	constructor(value: T) {
		super(new InternalState(value));
	}

	set(value: T) {
		(this.internal as InternalState<T>).set(value);
	}
}

let current: InternalComputed<any> | undefined;

export class Computed<T> extends Signal<T> {
	constructor(map: () => T) {
		super(
			new InternalComputed(() => {
				const prev = current;
				current = this.internal as InternalComputed<any>;

				const result = map();

				current = prev;
				return result;
			}),
		);
	}
}

export function useEffect(effectCallback: () => void) {
	const effect = new Computed<void>(effectCallback);
	effect.get();
}

export function useState<T>(value: T) {
	return new State(value);
}

export function useComputed<T>(map: () => T) {
	return new Computed(map);
}
