export class State<T = any> {
	#value: T;
	constructor(value: T) {
		this.#value = value;
	}

	get = () => this.#value;
	set(value: T) {
		this.#value = value;

		this.#dispatch("change");
	}
	#dispatch(event: string) {
		this.#listeners.dispatchEvent(new Event(event));
	}

	#listeners = new EventTarget();
	on(event: StateEventType, listener: () => void) {
		this.#listeners.addEventListener(event, listener);
	}
}

type StateEventType = "change";

export function useState<T>(states: State[], map: () => T): State<T>;
export function useState<T>(value: T): State<T>;
export function useState<T>(value: any, map?: any) {
	if (typeof map === "function") {
		return fromStates(value, map);
	} else {
		return new State<T>(value);
	}
}

export function fromStates<T>(states: State[], createValue: () => T) {
	const result = new State<T>(createValue());
	const update = () => {
		result.set(createValue());
	};
	for (const state of states) {
		state.on("change", update);
	}
	return result;
}
