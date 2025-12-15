import { describe, it } from 'vitest';
import { Button, FlexDiv, For, Modify, useState } from '../../src';

describe('For', () => {
	it('shows children from data', () => {
		const numbers = useState([1, 2, 3]);

		Modify(document.body, { html: '' }, [
			For(numbers, (n) => Button([`${n}`])),
		]);
	});

	it('adds and removes item', () => {
		const numbers = useState([1, 2, 3]);

		function addNumber() {
			const newNumber = numbers.get().length + 1;
			numbers.set([...numbers.get(), newNumber]);
		}
		function removeNumber(n: number) {
			numbers.set(numbers.get().filter((value) => value !== n));
		}

		Modify(document.body, { html: '' }, [
			FlexDiv([
				For(numbers, (n) =>
					Button([`${n}`], {
						on: { click: () => removeNumber(n) },
					}),
				),
			]),
			Button(['+'], { on: { click: addNumber } }),
		]);
	});
});
