import { assert, describe, expect, it } from "vitest";
import { Div } from "../src";
import {
	appendCallbacksRecord,
	createDescendantCallbacks,
	type DataRecord,
	extractCallbackRecord,
	extractDataValueRecord,
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

	it("get data from grand parent", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			[
				Div([
					Div({
						data: {
							theme: (value: string) => {
								theme = value;
							},
						},
					}),
				]),
			],
		);
		assert.equal(theme, "dark");
	});

	it("get data from nearest ancestor", () => {
		let theme: string | undefined;
		Div({ data: { theme: "light" } }, [
			Div({ data: { theme: "dark" } }, [
				Div({
					data: {
						theme: (value: string) => {
							theme = value;
						},
					},
				}),
			]),
		]);
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

describe(extractCallbackRecord, () => {
	it("returns undefined if input is undefined", () => {
		const callbacks = extractCallbackRecord(undefined);
		expect(callbacks).toBeUndefined();
	});
	it("extracts functions from object", () => {
		const record = { callback: () => {} } as DataRecord;
		const callbacks = extractCallbackRecord(record);
		assert(callbacks);
		expect(callbacks.callback).toEqual([record.callback]);
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

describe(createDescendantCallbacks, () => {
	it("returns undefined if input is undefined", () => {
		const actual = createDescendantCallbacks(undefined);
		expect(actual).toBeUndefined();
	});
	it("creates record of array of callback", () => {
		const record = { callback: () => {} };
		const actual = createDescendantCallbacks(record);
		assert(actual);
		expect(actual.callback).toEqual([record.callback]);
	});
});

describe(appendCallbacksRecord, () => {
	it("appends a callbacks record to a callbacks record", () => {
		const record1 = { callback: [() => {}] };
		const record2 = { callback: [() => {}] };
		appendCallbacksRecord(record1, record2);
		expect(record1.callback.length).toBe(2);
	});

	it("undefined can be added to record", () => {
		const record1 = { callback: [() => {}] };
		appendCallbacksRecord(record1, undefined);
		expect(record1.callback.length).toBe(1);
	});
});
