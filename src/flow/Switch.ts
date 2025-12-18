import { nodeData } from "../data/data";
import { getNextNodeSibling } from "../initializeChildBlock";
import type { State } from "../State";
import { ControlFlow } from "./ControlFlow";
import type { SwitchSection } from "./SwitchBlockState";

export function Switch<T>(
	value: State<T>,
	sections: SwitchSection<T>[],
	createDefault?: () => Element,
): ControlFlow {
	return new SwitchFlow(value, sections, createDefault);
}
export class SwitchFlow<T> extends ControlFlow {
	#value: State<T>;
	#sections: SwitchSection<T>[];
	#createDefault?: () => Element;

	constructor(
		value: State<T>,
		sections: SwitchSection<T>[],
		createDefault?: () => Element,
	) {
		super();
		this.#value = value;
		this.#sections = sections;
		this.#createDefault = createDefault;
	}

	run(element: Element) {
		const value2Element = new Map<T, Element>();
		const value2Section = new Map<T, SwitchSection<T>>();

		for (const section of this.#sections) {
			value2Section.set(section.case, section);
		}

		let currentElement: Element | undefined;
		let defaultElement: Element | undefined;

		const getElementFromValue = (value: T) => {
			const section = value2Section.get(value);
			if (section) {
				// If element is not created yet, create and cache
				if (!value2Element.has(value)) {
					const newElement = section.show();
					value2Element.set(value, newElement);
				}
				return value2Element.get(value)!;
			}

			// ensure default
			if (this.#createDefault && !defaultElement) {
				defaultElement = this.#createDefault();
			}
			return defaultElement;
		};

		const update = () => {
			const value = this.#value.get();
			const nextNode = getNextNodeSibling(this);

			const newElement = getElementFromValue(value);
			// data
			newElement && nodeData.resolveCallbacks(element, newElement);
			// insert `newElement`
			currentElement?.remove();
			newElement && element.insertBefore(newElement, nextNode);
			currentElement = newElement;
		};

		update();

		this.#value.on("change", update);
	}
}
