import { assert, describe, expect, it } from "vitest";
import { Div } from "../src";
import { NodeData } from "../src/data";

describe("data", () => {
	it("get data from self", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			{
				data: {
					theme: (value: string) => {
						theme = value;
					},
				},
			},
		);
		assert.equal(theme, "dark");
	});

	it("get data from parent", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			[
				Div({
					data: {
						theme: (value: string) => {
							theme = value;
						},
					},
				}),
			],
		);
		assert.equal(theme, "dark");
	});

	it("ignores callback if data isn't  set", () => {
		let counter = 0;
		Div([
			Div({
				data: {
					theme: () => {
						counter++;
					},
				},
			}),
		]);
		assert.equal(counter, 0);
	});
});

describe(NodeData, () => {
	it("", () => {
		const nodes = [Div(), Div()];

		const data = new NodeData();
		const callback = () => {};
		data.setCallback(nodes[1], "theme", callback);
		data.setData(nodes[0], "theme", "dark");
		data.resolveDataCallback(nodes[0], nodes[1]);
		expect(data.getDescendantCallbacks(nodes[0])).toEqual({
			theme: [callback],
		});
	});
});
