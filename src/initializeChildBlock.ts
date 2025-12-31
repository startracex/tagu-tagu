import { nodeData } from "./data/data";
import { ControlFlow } from "./flow/ControlFlow";
import { applyStringOrSignal } from "./Modify";
import { Signal } from "./signal/Signal";

export type ChildType = Node | string | Signal | ControlFlow;
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
		nodeData.resolveCallbacks(element, child);
		element.appendChild(child);
	}
}

export function resolveTextNode(children: ChildType[]): (Node | ControlFlow)[] {
	return children.map((c) => {
		if (typeof c === "string" || c instanceof Signal) {
			const textNode = document.createTextNode("");
			applyStringOrSignal(c, (text) => {
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

	if (next.firstNode) return next.firstNode;
	return getNextNodeSiblingVirtual(next);
}

export function getNextNodeSibling(flow: ControlFlow) {
	const virtual = getNextNodeSiblingVirtual(flow);
	return virtual?.parentElement ? virtual : null;
}
