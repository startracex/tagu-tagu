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

	it("cleanup effect", () => {
		const counter = useState(3);
		const isEven = useComputed(() => {
			return counter.get() % 2 === 0;
		});
		const isEvenText = useComputed(() => {
			return isEven.get() ? "Even" : "Odd";
		});
		const log = [] as string[];

		useEffect((effect) => {
			log.push(isEvenText.get());
			effect.onCleanup(() => {
				log.push("cleanup");
			});
		});

		assert.deepEqual(log, ["Odd"]);
		counter.set(2);
		assert.deepEqual(log, ["Odd", "cleanup", "Even"]);
	});

	it("reconstruct dependencies", () => {
		const flag = useState(true);
		const value1 = useState(0);
		const value2 = useState(1);
		const computed = useComputed(() =>
			flag.get() ? value1.get() : value2.get(),
		);

		const log = [] as string[];
		useEffect(() => {
			log.push(`${computed.get()}`);
		});

		assert.deepEqual(log, ["0"]);
		value1.set(-1);
		assert.deepEqual(log, ["0", "-1"]);
		value2.set(2); // `computed` doesn't change
		assert.deepEqual(log, ["0", "-1"]);

		flag.set(false);
		assert.deepEqual(log, ["0", "-1", "2"]);
		value2.set(3);
		assert.deepEqual(log, ["0", "-1", "2", "3"]);
		value1.set(0); // `computed` doesn't change
		assert.deepEqual(log, ["0", "-1", "2", "3"]);
	});
});
