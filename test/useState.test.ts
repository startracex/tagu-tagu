import { assert, describe, it } from "vitest";
import { useState } from "../src";

describe(useState, () => {
	it("can be initialized from `State`s", () => {
		const input = useState(false);
		const not = useState([input], () => !input.get());
		assert(not.get());
		input.set(true);
		assert(!not.get());
	});
	it("from `State`", () => {
		const input = useState(false);
		const not = useState(input, (value) => !value);
		assert(not.get());
		input.set(true);
		assert(!not.get());
	});
});
