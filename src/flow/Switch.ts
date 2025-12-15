import { Div } from '../Elements';
import type { State } from '../State';
import type { SwitchSection } from './SwitchBlockState';

export function Switch<T>(
	value: State<T>,
	sections: SwitchSection<T>[],
	createDefault?: () => Element,
) {
	return new SwitchFlow(value, sections, createDefault);
}
export class SwitchFlow<T> {
	#value: State<T>;
	#sections: SwitchSection<T>[];
	#createDefault?: () => Element;

	constructor(
		value: State<T>,
		sections: SwitchSection<T>[],
		createDefault?: () => Element,
	) {
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
		const update = () => {
			const value = this.#value.get();
			const section = value2Section.get(value);

			// If element is not created yet, create and cache
			if (!value2Element.has(value)) {
				const newElement =
					section?.show() ??
					this.#createDefault?.() ??
					Div({ css: { display: 'none' } }, ['Test']);
				value2Element.set(value, newElement);
			}

			const newElement = value2Element.get(value)!;
			if (currentElement) {
				element.replaceChild(newElement, currentElement);
			} else {
				element.appendChild(newElement);
			}
			currentElement = newElement;
		};

		update();

		this.#value.on('change', update);
	}
}
