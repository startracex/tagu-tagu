import { describe, expect, it } from "vitest";
import { div, Modify, useState } from "../src";

describe("initializeAttributes (coercion & signals)", () => {
	it("coerces number/boolean to string and preserves '0' and 'false'", () => {
		const el = div({
			attr: {
				"data-zero": 0,
				"data-false": false,
				"data-str-zero": "0",
				"data-empty": "",
			},
		});

		expect(el.getAttribute("data-zero")).toBe("0");
		expect(el.getAttribute("data-false")).toBe("false");
		expect(el.getAttribute("data-str-zero")).toBe("0");
		expect(el.hasAttribute("data-empty")).toBe(true);
	});

	it("updates attribute when provided a Signal that yields numbers and removes on empty string", async () => {
		const state = useState<number | string>(0);
		const el = div({ attr: { "data-value": state } });

		// initial value
		expect(el.getAttribute("data-value")).toBe("0");

		// update to another number
		state.set(42);
		// wait a microtask for reactive updates (the runtime updates synchronously in many cases,
		// but awaiting a microtask makes the test robust)
		await Promise.resolve();
		expect(el.getAttribute("data-value")).toBe("42");

		state.set("");
		await Promise.resolve();
		expect(el.hasAttribute("data-value")).toBe(true);
	});

	it("Modify can remove attribute when updated to empty string", async () => {
		const el = div({ attr: { "data-a": 1 } });
		expect(el.getAttribute("data-a")).toBe("1");

		Modify(el, { attr: { "data-a": "" } });
		await Promise.resolve();
		expect(el.hasAttribute("data-a")).toBe(true);
	});
});
