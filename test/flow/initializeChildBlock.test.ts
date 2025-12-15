import { assert, describe, expect, it } from "vitest";
import { Div, useState } from "../../src";
import { ControlFlow } from "../../src/flow/ControlFlow";
import {
	connectNeighbours,
	getNextNodeSiblingVirtual,
	resolveTextNode,
} from "../../src/initializeChildBlock";

describe(resolveTextNode, () => {
	it("string to Text", () => {
		const input = ["Hello"];
		const actual = resolveTextNode(input);
		assert(actual[0] instanceof Text);
		expect(actual[0].textContent).toBe("Hello");
	});
	it("State<string> to Text", () => {
		const input = [useState("Hello")];
		const actual = resolveTextNode(input);
		assert(actual[0] instanceof Text);
		expect(actual[0].textContent).toBe("Hello");
	});
});

class ControlFlowMock extends ControlFlow {
	constructor(children: Node[] = []) {
		super();
		this.nodes = children;
	}
	run(_: Element) {}
}
describe(connectNeighbours, () => {
	it("connect ControlFlow and <div>", () => {
		const children = [new ControlFlowMock(), Div()];
		connectNeighbours(children);
		assert(children[0] instanceof ControlFlow);
		expect(children[0].next).toBe(children[1]);
	});

	it("connect <div> and ControlFlow", () => {
		const children = [Div(), new ControlFlowMock()];
		connectNeighbours(children);
		assert(children[1] instanceof ControlFlow);
		expect(children[1].next).toBe(null);
	});
});

describe(getNextNodeSiblingVirtual, () => {
	it("null", () => {
		const children = [new ControlFlowMock()];
		connectNeighbours(children);
		const actual = getNextNodeSiblingVirtual(children[0] as ControlFlow);
		expect(actual).toBe(null);
	});

	it("Node", () => {
		const children = [new ControlFlowMock(), Div()];
		connectNeighbours(children);
		const actual = getNextNodeSiblingVirtual(children[0] as ControlFlow);
		expect(actual).toBe(children[1]);
	});

	it("ControlFlow with nodes", () => {
		const children = [
			new ControlFlowMock(),
			new ControlFlowMock([Div(), Div()]),
			Div(),
		];
		connectNeighbours(children);
		const actual = getNextNodeSiblingVirtual(children[0] as ControlFlow);
		expect(actual).toBe((children[1] as ControlFlow).nodes[0]);
	});

	it("ControlFlow without nodes", () => {
		const children = [new ControlFlowMock(), new ControlFlowMock(), Div()];
		connectNeighbours(children);
		const actual = getNextNodeSiblingVirtual(children[0] as ControlFlow);
		expect(actual).toBe(children[2]);
	});
});
