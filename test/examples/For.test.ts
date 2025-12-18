import { describe, it } from "vitest";
import { button, FlexDiv, For, Modify, useState } from "../../src";

describe("For", () => {
	it("shows children from data", () => {
		const numbers = useState([1, 2, 3]);

		Modify(document.body, { html: "" }, [For(numbers, (n) => button(`${n}`))]);
	});

	it("adds and removes item", () => {
		const numbers = useState([1, 2, 3].map((n) => ({ n })));

		function addNumber() {
			const newNumber = numbers.get().length + 1;
			numbers.set([...numbers.get(), { n: newNumber }]);
		}
		function removeNumber(n: number) {
			numbers.set(numbers.get().filter((value) => value.n !== n));
		}

		Modify(document.body, { html: "" }, [
			FlexDiv([
				For(numbers, (n) =>
					button(`${n.n}`, {
						on: { click: () => removeNumber(n.n) },
					}),
				),
			]),
			button("+", { on: { click: addNumber } }),
		]);
	});
});
