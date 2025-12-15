import { getNextNodeSibling } from "../initializeChildBlock";
import type { State } from "../State";
import { ControlFlow } from "./ControlFlow";

export function For<T>(
	array: State<readonly T[]>,
	map: (value: T) => Node | string,
) {
	return new ForMap(array, map);
}

export class ForMap<T> extends ControlFlow {
	constructor(
		private list: State<readonly T[]>,
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
			for (const child of [...view2Model.keys()]) {
				// child might not be appended yet. (so we need `?`)
				child.parentElement?.removeChild(child);
			}

			const next = getNextNodeSibling(this);
			for (const model of this.list.get()) {
				element.insertBefore(model2View.get(model)!, next);
			}
			this.firstNode = model2View.get(this.list.get()[0]) ?? null;
		};

		updateListUI();
		this.list.on("change", () => {
			updateListUI();
		});
	}
}
