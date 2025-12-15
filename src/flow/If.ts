import { getNextNodeSibling } from "../initializeChildBlock";
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
			const next = getNextNodeSibling(this);

			if (this.#condition.get()) {
				if (!child) child = this.#createThen();

				this.firstNode = child;
				elseChild?.remove();
				element.insertBefore(child, next);
			} else {
				if (!elseChild) elseChild = this.#createElse?.();

				this.firstNode = elseChild ?? null;
				child?.remove();
				elseChild && element.insertBefore(elseChild, next);
			}
		};

		update();

		this.#condition.on("change", update);
	}
}
