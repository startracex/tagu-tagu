import { ControlFlow } from "./flow/ControlFlow";
import { applyStringOrState } from "./Modify";
import { State } from "./State";

export type ChildType = Node | string | State | ControlFlow;
export function initializeChildBlock(element: Element, children: ChildType[]) {
	const resolvedChildren = resolveTextNode(children);
	connectNeighbours(resolvedChildren);

	for (const child of resolvedChildren) {
		initializeChild(element, child);
	}
}

function initializeChild(element: Element, child: ControlFlow | Node) {
	if (child instanceof ControlFlow) {
		child.run(element);
	} else {
		element.appendChild(child);
	}
}

export function resolveTextNode(children: ChildType[]): (Node | ControlFlow)[] {
	return children.map((c) => {
		if (typeof c === "string" || c instanceof State) {
			const textNode = document.createTextNode("");
			applyStringOrState(c, (text) => {
				textNode.textContent = text;
			});
			return textNode;
		}
		return c;
	});
}

export function connectNeighbours(children: (Node | ControlFlow)[]) {
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child instanceof ControlFlow) {
			child.next = children[i + 1] ?? null;
		}
	}
}

export function getNextNodeSiblingVirtual(flow: ControlFlow) {
	const next = flow.next;
	if (next === null) return null;
	if (next instanceof Node) return next;

	if (next.nodes[0]) return next.nodes[0];
	return getNextNodeSiblingVirtual(next);
}
