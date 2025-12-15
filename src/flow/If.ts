import type { State } from '../State';

export function If(
	condition: State<boolean>,
	show: () => Element,
	showElse?: () => Element,
) {
	return new IfFlow(condition, show, showElse);
}
export class IfFlow {
	#condition: State<boolean>;
	#createThen: () => Element;
	#createElse?: () => Element;

	constructor(
		condition: State<boolean>,
		create: () => Element,
		createElse?: () => Element,
	) {
		this.#condition = condition;
		this.#createThen = create;
		this.#createElse = createElse;
	}

	run(element: Element) {
		const previous = element.lastChild;
		let child: Element;
		let elseChild: Element | undefined;

		const update = () => {
			if (this.#condition.get()) {
				if (!child) child = this.#createThen();

				elseChild?.remove();
				element.insertBefore(child, previous?.nextSibling as null);
			} else {
				if (!elseChild) elseChild = this.#createElse?.();

				child?.remove();
				elseChild &&
					element.insertBefore(elseChild, previous?.nextSibling as null);
			}
		};

		update();

		this.#condition.on('change', update);
	}
}
