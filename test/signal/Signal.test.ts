import { assert, describe, it } from "vitest";
import { useComputed, useEffect, useState } from "../../src/signal/Signal";

describe(useState, () => {
	it("a Computed", () => {
		const counter = useState(3);
		const isEven = useComputed(() => {
			return counter.get() % 2 === 0;
		});
		assert.equal(isEven.get(), false);
		counter.set(2);
		assert.equal(isEven.get(), true);
	});

	it("chain of Computed", () => {
		const counter = useState(3);
		const isEven = useComputed(() => {
			return counter.get() % 2 === 0;
		});
		const isEvenText = useComputed(() => {
			return isEven.get() ? "Even" : "Odd";
		});

		assert.equal(isEvenText.get(), "Odd");
		counter.set(2);
		assert.equal(isEvenText.get(), "Even");
	});

	it("useEffect", () => {
		const counter = useState(3);
		const isEven = useComputed(() => {
			return counter.get() % 2 === 0;
		});
		const isEvenText = useComputed(() => {
			return isEven.get() ? "Even" : "Odd";
		});
		const log = [] as string[];

		useEffect(() => {
			log.push(isEvenText.get());
		});

		assert.deepEqual(log, ["Odd"]);
		counter.set(2);
		assert.deepEqual(log, ["Odd", "Even"]);
	});
});
