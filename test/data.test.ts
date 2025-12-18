import { assert, describe, expect, it } from "vitest";
import { Div } from "../src";
import {
	type DataRecord,
	extractCallbackRecord,
	extractDataValueRecord,
	NodeData,
} from "../src/data";

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
	it("getDescendantCallbacks", () => {
		const nodes = [Div(), Div()];

		const data = new NodeData();
		const callback = () => {};
		data.setCallbackRecord(nodes[1], { theme: callback });
		data.setDataRecord(nodes[0], { theme: "dark" });
		data.resolveCallbacks(nodes[0], nodes[1]);
		expect(data.getDescendantCallbacks(nodes[0])).toEqual({
			theme: [callback],
		});
	});
});

describe(extractCallbackRecord, () => {
	it("returns undefined if input is undefined", () => {
		const callbacks = extractCallbackRecord(undefined);
		expect(callbacks).toBeUndefined();
	});
	it("extracts functions from object", () => {
		const record = { callback: () => {} } as DataRecord;
		const callbacks = extractCallbackRecord(record);
		assert(callbacks);
		expect(callbacks.callback).toBe(record.callback);
	});
	it("returns undefined if input doesn't contain callback", () => {
		const callbacks = extractCallbackRecord({ x: 2 });
		expect(callbacks).toBeUndefined();
	});
});

describe(extractDataValueRecord, () => {
	it("returns undefined if input is undefined", () => {
		const actual = extractDataValueRecord(undefined);
		expect(actual).toBeUndefined();
	});
	it("extracts functions from object", () => {
		const actual = extractDataValueRecord({ callback: () => {} });
		expect(actual).toBeUndefined();
	});
	it("returns undefined if input doesn't contain callback", () => {
		const record = { x: 2 } as DataRecord;
		const actual = extractDataValueRecord(record);
		assert(actual);
		expect(actual.callback).toBe(record.callback);
	});
});
