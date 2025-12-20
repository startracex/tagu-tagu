import { assert, describe, expect, it } from "vitest";
import { div } from "../../src";
import {
	appendCallbacksRecord,
	extractCallbackRecord,
	nodeData,
	waitForData,
} from "../../src/data/data";

describe("internal cache data", () => {
	it("has undefined for callbacks resolved", () => {
		const element = div({ data: { theme: "dark" } }, [
			div((node) => waitForData(node, { theme: () => {} })),
		]);
		assert(!nodeData.node2DescendantCallbacks.get(element));
	});
});

describe(extractCallbackRecord, () => {
	it("returns undefined if input is undefined", () => {
		const callbacks = extractCallbackRecord(undefined);
		expect(callbacks).toBeUndefined();
	});
	it("func -> [func]", () => {
		const record = { callback: () => {} };
		const callbacks = extractCallbackRecord(record);
		assert(callbacks);
		expect(callbacks.callback).toEqual([record.callback]);
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
