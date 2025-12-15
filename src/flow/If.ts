import { getNextNodeSiblingVirtual } from "../initializeChildBlock";
import type { State } from "../State";
import { ControlFlow } from "./ControlFlow";

export function If(
	condition: State<boolean>,
	show: () => Element,
	showElse?: () => Element,
) {
	return new IfFlow(condition, show, showElse);
}
export class IfFlow extends ControlFlow {
	#condition: State<boolean>;
	#createThen: () => Element;
	#createElse?: () => Element;

	constructor(
		condition: State<boolean>,
		create: () => Element,
		createElse?: () => Element,
	) {
		super();
		this.#condition = condition;
		this.#createThen = create;
		this.#createElse = createElse;
	}

	run(element: Element) {
		let child: Element;
		let elseChild: Element | undefined;

		const update = () => {
			// next node might not be added to parent on init process
			const nextInVirtual = getNextNodeSiblingVirtual(this);
			const next = nextInVirtual?.parentElement ? nextInVirtual : null;

			if (this.#condition.get()) {
				if (!child) child = this.#createThen();

				this.nodes = [child];
				elseChild?.remove();
				element.insertBefore(child, next);
			} else {
				if (!elseChild) elseChild = this.#createElse?.();

				this.nodes = [elseChild].filter((n) => n) as Element[];
				child?.remove();
				elseChild && element.insertBefore(elseChild, next);
			}
		};

		update();

		this.#condition.on("change", update);
	}
}
