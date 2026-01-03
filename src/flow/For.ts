import { nodeData } from "../data/data";
import { getNextNodeSibling } from "../initializeChildBlock";
import { type Signal, useEffect } from "../signal/Signal";
import { ControlFlow } from "./ControlFlow";

export function For<T>(
	array: Signal<readonly T[]>,
	map: (value: T) => Node | string,
): ControlFlow {
	return new ForMap(array, map);
}

export class ForMap<T> extends ControlFlow {
	constructor(
		private list: Signal<readonly T[]>,
		private map: (value: T) => Node | string,
	) {
		super();
	}

	run(element: Element) {
		const model2View = new Map<T, Node>();
		const view2Model = new Map<Node, T>();

		// When list is updated, check diffs.
		// Create UIs for added models and delete UIs for deleted models.
		const updateListUI = () => {
			// Added models
			const itemsAdded = [] as T[];
			for (const item of this.list.get()) {
				if (!model2View.has(item)) itemsAdded.push(item);
			}

			// UIs to remove
			const viewsToRemove = [] as Node[];
			const listSet = new Set<T>(this.list.get());
			for (const view of view2Model.keys()) {
				const oldItem = view2Model.get(view);
				if (oldItem && !listSet.has(oldItem)) viewsToRemove.push(view);
			}

			// Add UIs for added models
			for (const item of itemsAdded) {
				const mapped = this.map(item);
				const resolved =
					typeof mapped === "string" ? document.createTextNode(mapped) : mapped;

				// data
				nodeData.resolveCallbacks(element, resolved);

				// To insert `item`
				view2Model.set(resolved, item);
				model2View.set(item, resolved);
			}

			// Remove UIs
			for (const view of viewsToRemove) {
				view.parentNode?.removeChild(view);
				const model = view2Model.get(view);
				view2Model.delete(view);
				model && model2View.delete(model);
			}

			// Sort
			const next = getNextNodeSibling(this);
			const modelArray = this.list.get();
			const firstView = model2View.get(modelArray[0])!;
			if (firstView && !firstView.parentNode) {
				element.insertBefore(firstView, next);
			}
			for (let i = 0; i < modelArray.length - 1; i++) {
				const prev = model2View.get(modelArray[i])!;
				const expected = model2View.get(modelArray[i + 1])!;
				const actual = prev?.nextSibling;
				if (expected !== actual) {
					element.insertBefore(expected, actual);
				}
			}

			this.firstNode = model2View.get(this.list.get()[0]) ?? null;
		};

		useEffect(updateListUI);
	}
}
